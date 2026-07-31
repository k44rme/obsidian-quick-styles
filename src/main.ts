import { Plugin, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_STYLES_TAB } from './constants';
import StylesView from './styles_view';
import { DEFAULT_SETTINGS, QuickStylesSettings, QuickStylesSettingsTab } from './settings';

export default class QuickStylesPlugin extends Plugin {
	settings!: Partial<QuickStylesSettings>;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new QuickStylesSettingsTab(this.app, this))
		this.registerExtensions(['css'], VIEW_TYPE_STYLES_TAB);
		this.registerView(VIEW_TYPE_STYLES_TAB, (leaf) => new StylesView(leaf));

		this.addCommand({
			id: 'open-quick-styles-tab',
			name: 'Open styles tab',
			callback: () => this.activateView(),
		});

		this.addRibbonIcon('scroll-text', 'Open styles tab', () =>
			this.activateView(),
		);
	}

	async activateView() {
		const { workspace } = this.app;

		// Reuse existing leaf if open
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_STYLES_TAB);
		let all_leaves: WorkspaceLeaf[] | null = leaves.length ? leaves : null;
		let leaf = all_leaves ? all_leaves[0] : null;

		if (!leaf) {
			// Create new leaf in the right sidebar
			leaf = workspace.getRightLeaf(false);
			if (!leaf) {
				return; // or throw / show notice
			}

			await leaf.setViewState({
				type: VIEW_TYPE_STYLES_TAB,
				active: true,
			});
		}

		// leaf is non-null here
		await workspace.revealLeaf(leaf);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		)
	}

	public async loadData(): Promise<Partial<QuickStylesSettings>> {
		return await this.loadData()
	}

	public async saveData(data: Partial<QuickStylesSettings> | Promise<Partial<QuickStylesSettings>>): Promise<void> {
		await this.saveData(data)
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
