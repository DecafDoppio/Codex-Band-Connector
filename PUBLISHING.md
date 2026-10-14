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

快应用分支根目录包含 manifest_v2.json、media 和 downloads。设备仅 xmb11，版本 1.3.1；作者 DecafDoppio 绑定 AstroBox。官方资源索引需要 repo_owner=DecafDoppio、repo_name=Codex-Band-Connector 和发布分支的实际提交 SHA；标签建议 Codex;AI;开发工具。官方源通过提交 SHA 定位内容。CreatorConsole 自动创建仓库的流程与现有两库不同，提交时检查生成目标，勿自动创建重复仓库。

独立发布分支尚未创建，也未提交官方审核。本说明不自动推送或上架。

官方资料：
- https://abox.run/docs/creator-tools/resource-management/plugin-upload
- https://abox.run/docs/creator-tools/resource-management/free-resources
- https://github.com/AstralSightStudios/AstroBox-Repo/blob/main/assets/docs/ResAdptV2.md
