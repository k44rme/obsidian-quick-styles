import { IconName, ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_STYLES_TAB } from './constants';
import { Notice } from 'obsidian';
import QuickStylesPlugin from './main';
import { QuickStylesSettings } from './settings';

export default class StylesView extends ItemView {
	plugin!: QuickStylesPlugin;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getDisplayText(): string {
		return 'Styles';
	}

	getViewType(): string {
		return VIEW_TYPE_STYLES_TAB;
	}

	getIcon(): IconName {
		return 'scroll-text';
	}

	protected async onOpen(): Promise<void> {

		const container = this.contentEl;
		container.empty();
		container.addClass('style-page');
		const header = container.createEl('h2', { text: 'Quick styles' });
		const get_header_size = async () => this.plugin.loadData().then((value) => { return value.header_size } )
		const size = get_header_size.toString()
		header.dataset.size = size

		const snippet_name = container.createEl('input', {
			cls: 'snippet-name',
            placeholder: "Type the snippet name without .css"
		});
		const styles_area = container.createEl('textarea', { cls: 'css-area', text: ".something {\n\tcolor: #fff;\n}" });
		const select = container.createEl("select")

		select.createEl("option", { value: "overwrite", text: "Overwrite whole file" })
		select.createEl("option", { value: "append", text: "Append content" })

		const btn = container.createEl('button', { cls: 'style-saver', text: 'Save' });
		btn.on('click', 'button', async () => {
			const path = this.getSnippetPath(snippet_name.value);
            const adapter = this.app.vault.adapter;

			if (snippet_name.value == "") {
				new Notice("Type the snippet name!!!", 1000);
				return;
			}

			if (select.value == "append") {
				if (await adapter.exists(path)) {
					await adapter.append(path.normalize(), styles_area.value);
				} else {
					await adapter.write(path, styles_area.value);
				}
			} else {
				await adapter.write(path, styles_area.value)
			}

            new Notice("Snippet has been saved!", 3000)
		});
	}

	private getSnippetPath(name: string): string {
		// Ensure .css extension
		const fileName = name.endsWith('.css') ? name : `${name}.css`;
		return `${this.snippetsDir}/${fileName}`;
	}

	private get snippetsDir(): string {
		return `${this.app.vault.configDir}/snippets`;
	}

	protected async onClose(): Promise<void> {}
}
