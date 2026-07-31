import { App, PluginSettingTab, Setting } from 'obsidian';
import QuickStylesPlugin from './main';
import { HEADER_SIZE_LEVEL } from './constants';

export interface QuickStylesSettings {
	header_size: string
}

export const DEFAULT_SETTINGS: Partial<QuickStylesSettings> = {
	header_size: "1",
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
			.setDesc("Makes the header smaller or larger depends on user's choice")
			.addDropdown((thing) => {
				thing
					.setValue("1")
					.addOption("1", "Largest")
					.addOption("2", "Larger")
					.addOption("3", "Normal")
					.addOption("4", "Smaller")
					.addOption("5", "Smallest")
					.onChange(async (val) => {
						let data: Promise<Partial<QuickStylesSettings>> = this.plugin.loadData();

						await data.then((d) => d.header_size = val)

						await this.plugin.saveData(data)
					})
			})
	}
}
