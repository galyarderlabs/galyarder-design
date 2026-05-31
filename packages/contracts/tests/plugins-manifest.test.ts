import { describe, expect, it } from 'vitest';
import {
  GALYARDER_DESIGN_PLUGIN_SPEC_VERSION,
  MarketplacePluginEntrySchema,
  PluginManifestSchema,
  resolveLocalizedText,
} from '../src/plugins/index.js';

describe('plugin manifest localized text', () => {
  it('exports the current plugin spec version for manifests and registries', () => {
    expect(GALYARDER_DESIGN_PLUGIN_SPEC_VERSION).toBe('1.0.0');
  });

  it('accepts legacy string use-case queries', () => {
    const manifest = PluginManifestSchema.parse({
      name: 'sample-plugin',
      version: '1.0.0',
      gd: {
        useCase: {
          query: 'Make a {{topic}} brief.',
        },
      },
    });

    expect(manifest.gd?.useCase?.query).toBe('Make a {{topic}} brief.');
  });

  it('accepts locale-map use-case queries', () => {
    const manifest = PluginManifestSchema.parse({
      name: 'sample-plugin',
      version: '1.0.0',
      gd: {
        useCase: {
          query: {
            // i18n locale fixture; CJK is the zh-CN translation, kept verbatim.
            en: 'Make a {{topic}} brief.',
            'zh-CN': '围绕 {{topic}} 写一份简报。',
          },
        },
      },
    });

    expect(resolveLocalizedText(manifest.gd?.useCase?.query)).toBe(
      'Make a {{topic}} brief.',
    );
  });

  it('accepts localized title and description metadata', () => {
    const manifest = PluginManifestSchema.parse({
      name: 'sample-plugin',
      version: '1.0.0',
      title: 'Sample Plugin',
      title_i18n: {
        // i18n locale fixture; CJK kept verbatim.
        en: 'Sample Plugin',
        'zh-CN': '示例插件',
      },
      description: 'English fallback.',
      description_i18n: {
        // i18n locale fixture; CJK kept verbatim.
        en: 'English fallback.',
        'zh-CN': '中文描述。',
      },
    });

    expect(resolveLocalizedText(manifest.title_i18n)).toBe('Sample Plugin');
    expect(resolveLocalizedText(manifest.description_i18n)).toBe('English fallback.');
  });

  it('accepts localized marketplace entry metadata', () => {
    const entry = MarketplacePluginEntrySchema.parse({
      name: 'galyarder-design/example-sample',
      source: 'github:galyarder-design/plugins/examples/sample',
      version: '1.0.0',
      title: 'Sample',
      title_i18n: {
        // i18n locale fixture; CJK kept verbatim.
        en: 'Sample',
        'zh-CN': '示例',
      },
      description: 'English fallback.',
      description_i18n: {
        // i18n locale fixture; CJK kept verbatim.
        en: 'English fallback.',
        'zh-CN': '中文描述。',
      },
    });

    expect(resolveLocalizedText(entry.title_i18n)).toBe('Sample');
    expect(resolveLocalizedText(entry.description_i18n)).toBe('English fallback.');
  });

  it('falls back from exact locale to base language, English, then first value', () => {
    // i18n resolver fixtures; CJK kept verbatim to verify locale fallback.
    expect(resolveLocalizedText({ en: 'English', zh: '中文' }, 'zh-CN')).toBe('中文');
    expect(resolveLocalizedText({ 'zh-CN': '中文' }, 'fr')).toBe('中文');
  });
});
