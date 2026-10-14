# GitHub 与 AstroBox 发布

## main 分支

提交源码、锁定依赖、构建脚本、许可证与 media。不要提交 dist、downloads、node_modules、target、.local、.publication、私钥或连接配置。本机旧产物可以保留，首次暂存须复核忽略规则与全部暂存文件。

## GitHub Releases

以实际确认的源码提交创建 v1.3.1 标签，Release 使用 RELEASE_NOTES.md；附件使用 .publication/github-release 中的安装包与 SHA256SUMS.txt。不重新编译替换已验收 RPK。

```powershell
python scripts/prepare-publication.py
```

命令默认读取本机 downloads 中已验收 1.3.1 RPK。新克隆可用 --rpk 外部已验收包路径；脚本校验固定哈希。

## AstroBox 发布分支

脚本生成 .publication/astrobox，作为未来 astrobox-release 分支的独立文件树；不把它提交到 main。操作前记录 main 的源码提交与 Release 对应关系。使用单独 checkout/worktree 提交该目录内容，避免覆盖源码工作目录。

快应用分支根目录包含 manifest_v2.json、media 和 downloads。设备 xmb11 和 xmb11nfc，版本 1.3.1；普通版有已记录真机验收，NFC 支持由维护者确认；作者 DecafDoppio 绑定 AstroBox。当前申请在官方资源库 PR 中新增 tmp/decafdoppio/codex-band-connector/resource.csv 与 request.json（schema_version=1，mode=create），不直接修改 index_v2.csv。resource.csv 含表头和本资源一行，引用发布分支实际提交 SHA；官方工作流在审核合并后应用索引。标签建议 Codex;AI;开发工具。手动 API 提交不伪造 CreatorConsole 客户端版本。CreatorConsole 自动创建仓库的流程与现有两库不同，提交时检查生成目标，勿自动创建重复仓库。

发布分支已创建，快应用审核申请见 https://github.com/AstralSightStudios/AstroBox-Repo/pull/1358 。是否上线以官方审核及工作流结果为准。

官方资料：
- https://abox.run/docs/creator-tools/resource-management/plugin-upload
- https://abox.run/docs/creator-tools/resource-management/free-resources
- https://github.com/AstralSightStudios/AstroBox-Repo/blob/main/assets/docs/ResAdptV2.md


