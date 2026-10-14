// Build ordinary UX/JS source, then sign with an external production identity.
// Never reads a historical RPK, never copies a private key into this project.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const root=path.resolve(__dirname,'..');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const privatePath=process.env.CODEX_BAND_SIGN_KEY,certificatePath=process.env.CODEX_BAND_SIGN_CERT;
 if(!privatePath||!certificatePath)throw Error('Set CODEX_BAND_SIGN_KEY and CODEX_BAND_SIGN_CERT to external production PEM files.');
 const toolkit=require('aiot-toolkit/package.json');
 if(toolkit.version!=='2.0.5')throw Error('aiot-toolkit must be 2.0.5; run npm ci.');
 const identity=JSON.parse(fs.readFileSync(path.join(root,'signing-identity.json'),'utf8'));
 const certificate=fs.readFileSync(certificatePath),privatekey=fs.readFileSync(privatePath);
 const cert=new crypto.X509Certificate(certificate);
 if(cert.fingerprint256!==identity.fingerprint256)throw Error('Certificate differs from the preserved production identity.');
 const challenge=Buffer.from('Codex Band Connector signing identity check');
 if(!crypto.verify('sha256',challenge,cert.publicKey,crypto.sign('sha256',challenge,privatekey)))throw Error('Private key does not match production certificate.');
 const cli=path.join(root,'node_modules/aiot-toolkit/bin/aiot.js');
 const bin=toolkit.bin;const relative=typeof bin==='string'?bin:bin.aiot;
 const actualCli=path.resolve(root,'node_modules/aiot-toolkit',relative);
 const started=Date.now();
 const built=cp.spawnSync(process.execPath,[actualCli,'build'],{cwd:root,encoding:'utf8'});
 process.stdout.write(built.stdout||'');process.stderr.write(built.stderr||'');
 if(built.status!==0||!/build success/.test(built.stdout||''))throw Error('Source compiler did not report success.');
 const output=path.join(root,'build');
 if(fs.statSync(path.join(output,'app.js')).mtimeMs<started-2000)throw Error('Compiler output is stale.');
 const JSZip=require('jszip'),ZipUtil=require('@aiot-toolkit/aiotpack/lib/compiler/javascript/vela/utils/ZipUtil').default;
 const compilerZip=await JSZip.loadAsync(fs.readFileSync(path.join(root,'dist/com.local.codexband.debug.1.1.8.rpk')));
 const release=JSON.parse(fs.readFileSync(path.join(root,'release.json'),'utf8'));
 const resourceList=[];
 function walk(directory,prefix=''){for(const entry of fs.readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const name=prefix+entry.name;if(entry.isDirectory())walk(path.join(directory,entry.name),name+'/');else if(!name.startsWith('META-INF/')||name==='META-INF/build.txt'){let content=fs.readFileSync(path.join(directory,entry.name));if(name==='manifest.json'||name==='manifest-watch.json'){const m=JSON.parse(content);m.versionName=release.versionName;m.versionCode=release.versionCode;m.name=release.name;content=Buffer.from(JSON.stringify(m,null,2)+'\n');}resourceList.push({fileBuildPath:name,fileContentBuffer:content});}}}
 walk(output);
 const digests=Object.fromEntries(resourceList.map(r=>[r.fileBuildPath,hash(r.fileContentBuffer)]));
 resourceList.unshift({fileBuildPath:'META-INF/CERT',fileContentBuffer:await ZipUtil.createZipBufferFromFileList([{path:'hash.json',content:Buffer.from(JSON.stringify({algorithm:'SHA-256',digests}))}],null)});
 const comment=compilerZip.comment;
 if(JSON.parse(comment).component!==true)throw Error('Component loader metadata missing.');
 const signed=await ZipUtil.buildProjectAndOutput({resourceList,comment,getResource:n=>resourceList.find(r=>r.fileBuildPath===n)},{privatekey,certificate});
 const target=path.join(root,'dist',`codex-band-${release.versionName}-source.rpk`);fs.writeFileSync(target,signed);
 const report={version:release.versionName,versionCode:release.versionCode,name:release.name,sha256:hash(signed),bytes:signed.length,certificateFingerprint256:cert.fingerprint256,payloadDigests:digests,compiler:toolkit.version,node:process.version,sourceBuild:true,historicalRpkRead:false};
 fs.writeFileSync(path.join(root,'dist/source-build.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({output:target,sha256:report.sha256,certificateFingerprint256:report.certificateFingerprint256}));
})().catch(e=>{console.error(e.message);process.exitCode=1;});
