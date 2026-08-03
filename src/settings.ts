import { App, debounce, Notice, PluginSettingTab, Setting } from 'obsidian';
import QuickStylesPlugin from './main';

export interface QuickStylesSettings {
	header_size: string;
	suggester_height: number;
}

export const DEFAULT_SETTINGS: Partial<QuickStylesSettings> = {
	header_size: '1',
	suggester_height: 75,
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
					.addOption('1', 'Largest')
					.addOption('2', 'Larger')
					.addOption('3', 'Normal')
					.addOption('4', 'Smaller')
					.addOption('5', 'Smallest')
					.addOption('6', 'Invisible')
					.setValue(val)
					.onChange(async (value) => {
						this.plugin.settings.header_size = value;
						await this.plugin.saveSettings();

						const header = document.querySelector(
							'.quick-styles-header',
						) as HTMLElement;
						if (header) {
							header.dataset.size =
								this.plugin.settings.header_size;
						}
					});
			});

		new Setting(containerEl)
			.setName('Snippet suggester height')
			.setDesc(
				`Changes default snippet suggester's height. The '0' value will change it to the fit-content property`,
			)
			.addSlider(async (slider) => {
				await this.plugin.loadSettings();
				slider
					.setLimits(0, 500, 5)
					.setValue(this.plugin.settings.suggester_height || 0)
					.onChange(async (val) => {
						this.plugin.settings.suggester_height = val;

						await this.plugin.saveSettings();

						const suggestion_container = document.querySelector(
							'.snippets-suggestion-container.open',
						) as HTMLDivElement;
						if (suggestion_container) {
							suggestion_container.dataset.height =
								this.plugin.settings.suggester_height.toString();
	
							if (this.plugin.settings.suggester_height == 0) {
								suggestion_container.dataset.height = 'fit-content';
							}
						}
					});
			});
	}
}
