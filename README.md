# Language Anchor for OpenClaw

Force English to keep your AI sharp. Force local language to keep it relevant.

An OpenClaw plugin that pins your AI's output language, preventing it from drifting into the wrong language mid-conversation. Dual injection makes it stick.

## Why You Need This

### Problem 1: "My AI got dumber after switching languages"
Models degrade when they drift away from English mid-conversation. A user writes in Japanese, the AI starts responding in Japanese, and reasoning quality drops. Force English to maintain peak performance.

### Problem 2: "I need responses in our local language, no matter what the user types"
Perfect for non-English deployments. User writes in English? AI answers in Japanese. User writes in Japanese? AI still answers in Japanese. Pin the output language to match your local context.

## How It Works

Other prompt-level solutions get buried and ignored by the model. Language Anchor injects at **two points** in every turn:

1. **System context** — persistent system-level override
2. **Turn context** — injected right before each user message

Dual injection makes the instruction much harder to ignore.

## Supported Languages

30 languages: English, 中文, हिन्दी, Español, العربية, বাংলা, Português, Русский, اردو, Bahasa Indonesia, Deutsch, 日本語, Kiswahili, मराठी, తెలుగు, Türkçe, தமிழ், 한국어, Tiếng Việt, Italiano, Yorùbá, Hausa, Afaan Oromoo, ਪੰਜਾਬੀ, فارسی, Basa Jawa, 吴语, ગુજરાતી, Soomaali, Magyar.

## Installation

```bash
openclaw plugins install https://github.com/lykeion-dev/language-anchor
```

## Configuration

Add to your `openclaw.json`:

```json
{
  "plugins": {
    "language-anchor": {
      "enabled": true,
      "config": {
        "language": "en"
      }
    }
  }
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `language` | `string` | `"en"` | ISO 639-1 language code |
| `targetAgents` | `string[]` | `["*"]` | Agent IDs to target (supports `*` wildcard) |
| `targetModels` | `string[]` | `["*"]` | Model name patterns (supports `*` wildcard) |
| `targetSessions` | `string[]` | `["*"]` | Session keys to target (supports `*` wildcard) |

### Examples

Force English to keep reasoning sharp:
```json
{
  "language": "en"
}
```

Force Japanese for a local deployment:
```json
{
  "language": "ja"
}
```

Target only specific models:
```json
{
  "language": "en",
  "targetModels": ["dashscope/*", "zai/*"]
}
```

## License

MIT
