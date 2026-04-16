# HypeTune Lab

一个专业的 AI 音乐创作工作站，旨在将音乐直觉解码为精准、可执行的创作蓝图和制作信号。

## 项目概述

`HypeTune Lab` 是专门为 AI 音乐创作者和制作人打造的实验环境。它利用大语言模型分析音乐的“氛围（Vibe）”，并将其逆向工程为四个维度的结构化数据：**和声 (Harmony)**、**节奏 (Rhythm)**、**音色 (Texture)** 和 **编曲 (Arrangement)**。

## 核心概念

本项目作为**听觉直觉**与**创作执行**之间的桥梁：
- **声音解构：** 分析作品的“声音基因”，识别其成功的关键要素。
- **精准提示词 (Precision Prompting)：** 将抽象的感受转化为适配 AI 工具（如 Suno, Udio 等）的高保真提示词。
- **风格映射：** 识别特定的声音目标，确保创作过程中风格的一致性。

## 核心功能

- **4D 分析框架：** 系统化拆解音乐的核心制作要素。
- **AI 优化提示词：** 为基于 LLM 的音乐生成提供结构化的输入。
- **中英双语支持：** 完美适配中英文不同的创作语境。
- **启发式挖掘：** 辅助创作者从浅层模仿转向深度理解后的创作。

## 技术栈

- **前端：** React + TypeScript
- **构建系统：** Vite
- **集成：** AI 处理引擎（基于 API）

## 快速开始

### 安装步骤

1. 克隆仓库：
   ```bash
   git clone <repository-url>
   cd hypetune-lab
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 环境变量配置：
   将 `.env.example` 复制为 `.env.local` 并配置你的 API Key。

4. 启动开发：
   ```bash
   npm run dev
   ```

## 部署 (Deployment)

本项目已适配 **Vercel** 云端部署：

1. 将代码推送到 GitHub。
2. 在 Vercel 控制台中导入该仓库。
3. 在项目设置中添加环境变量：`ZHIPU_API_KEY`（填入你的智谱 AI Key）。
4. 点击部署。Vercel 会自动识别 `api/` 目录下的 Serverless Functions 并完成上线。

## 开源协议

MIT 协议 - 详情请参阅 [LICENSE](LICENSE) 文件。
