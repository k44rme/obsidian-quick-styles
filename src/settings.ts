import { App, PluginSettingTab, Setting } from 'obsidian';
import QuickStylesPlugin from './main';

export interface QuickStylesSettings {
	header_size: number
}

export const DEFAULT_SETTINGS: QuickStylesSettings = {
	header_size: 0,
};

export class QuickStylesSettingsTab extends PluginSettingTab {
	plugin: QuickStylesPlugin;

	constructor(app: App, plugin: QuickStylesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Settings #1')
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder('Enter your secret')
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
