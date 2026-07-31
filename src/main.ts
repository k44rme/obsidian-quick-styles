import { Plugin, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_STYLES_TAB } from './constants';
import StylesView from './styles_view';
import {
	DEFAULT_SETTINGS,
	QuickStylesSettings,
	QuickStylesSettingsTab,
} from './settings';

export default class QuickStylesPlugin extends Plugin {
	settings!: Partial<QuickStylesSettings>;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new QuickStylesSettingsTab(this.app, this));
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

		const view = leaf.view;
		const container = view.containerEl;
		const header = container.querySelector(
			'.quick-styles-header',
		) as HTMLElement;

		await this.loadSettings();
		const size = this.settings.header_size;
		header.dataset.size = size;
	}

	async loadSettings() {
		try {
			this.settings = Object.assign(
				{},
				DEFAULT_SETTINGS,
				await this.loadData(),
			) as Partial<QuickStylesSettings>;
		} catch (e) {
			console.error('Failed to load settings, using defaults', e);
			this.settings = { ...DEFAULT_SETTINGS };
		}
	}

	async saveSettings() {
		try {
			await this.saveData(this.settings);
		} catch (error) {
			console.error(error);
		}
	}

	edit_header() {
        const header = document.querySelector('.quick-styles-header') as HTMLElement;
        if (header) {
            header.dataset.size = this.settings.header_size || "1";
        }
	}
}
