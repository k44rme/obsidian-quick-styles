import { App, PluginSettingTab, Setting } from 'obsidian';
import QuickStylesPlugin from './main';

export interface QuickStylesSettings {
	header_size: string;
}

export const DEFAULT_SETTINGS: Partial<QuickStylesSettings> = {
	header_size: '1',
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
			.setName('Header size')
			.setDesc(
				"Makes the header smaller or larger depends on user's choice. For now, header changes, but resets when obsidian restarts",
			)
			.addDropdown(async (dropdown) => {
				await this.plugin.loadSettings();

				const val = this.plugin.settings.header_size || '1';
				dropdown
					.setValue(val)
					.addOption('1', 'Largest')
					.addOption('2', 'Larger')
					.addOption('3', 'Normal')
					.addOption('4', 'Smaller')
					.addOption('5', 'Smallest')
					.addOption('6', 'Invisible')
					.onChange(async (value) => {
						this.plugin.settings.header_size = value;
						await this.plugin.saveSettings();

						const header = document.querySelector(".quick-styles-header") as HTMLElement;
						if (header) {
							header.dataset.size = this.plugin.settings.header_size
						}
					});
			});
	}
}
