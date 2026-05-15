# Language Enforcer for OpenClaw

An OpenClaw plugin that forces the AI to respond in a specific language, regardless of what language the user writes in.

## How It Works

Injects mandatory language instructions at two points in the prompt:

1. **System context** (`appendSystemContext`) — persistent system-level override
2. **Turn context** (`prependContext`) — injected before each user message

Dual injection maximizes compliance across different models.

## Supported Languages

Supports the top 30 languages by speaker count: English, 中文, हिन्दी, Español, العربية, বাংলা, Português, Русский, اردو, Bahasa Indonesia, Deutsch, 日本語, Kiswahili, मराठी, తెలుగు, Türkçe, தமிழ், 한국어, Tiếng Việt, Italiano, Yorùbá, Hausa, Afaan Oromoo, ਪੰਜਾਬੀ, فارسی, Basa Jawa, 吴语, ગુજરાતી, Soomaali, Magyar.

## Installation

```bash
openclaw plugins install https://github.com/wakaru-kun/language-enforcer
```

## Configuration

Add to your `openclaw.json`:

```json
{
  "plugins": {
    "language-enforcer": {
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

Force Japanese for a specific model:
```json
{
  "language": "ja",
  "targetModels": ["dashscope/*"]
}
```

Force Korean for a specific agent:
```json
{
  "language": "ko",
  "targetAgents": ["my-korean-bot"]
}
```

## License

MIT
