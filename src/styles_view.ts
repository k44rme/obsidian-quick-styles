import { IconName, ItemView, WorkspaceLeaf } from 'obsidian';
import { VIEW_TYPE_STYLES_TAB } from './constants';
import { Notice } from 'obsidian';
import QuickStylesPlugin from './main';

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
		container.createEl('h2', {
			text: 'Quick styles',
			cls: 'quick-styles-header',
		});

		const snippet_name: HTMLInputElement = container.createEl('input', {
			cls: 'snippet-name',
			placeholder: 'Type the snippet name without .css',
		});

		const snippets = container.createDiv({
			cls: 'snippets-suggestion-container',
		});

		const path = await this.app.vault.adapter.list(
			`${this.app.vault.configDir}/snippets`,
		);

		snippets
			.createSpan({
				text: '--Close Dropdown--',
				cls: 'snippet-suggestion',
			})
			.addEventListener('click', () => {
				snippets.removeClass('open');
			});

		for (const file of path.files) {
			let name = file
				.split(`${this.app.vault.configDir}/snippets`)
				.pop()
				?.split('/')
				.pop();

			const suggestion = snippets.createSpan({
				cls: 'snippet-suggestion',
				text: name,
			});
			suggestion.addEventListener('click', (ev) => {
				snippet_name.value = name || '';
				snippets.removeClass('open');
			});
		}

		snippet_name.addEventListener('focusin', () => {
			snippets.addClass('open');
		});

		const styles_area = container.createEl('textarea', {
			cls: 'snippet-content',
			text: '.something {\n\tcolor: #fff;\n}',
		});

		
		const select = container.createEl('select');
		
		select.createEl('option', {
			value: 'overwrite',
			text: 'Overwrite whole file',
		});
		select.createEl('option', { value: 'append', text: 'Append content' });
		
		const btn = container.createEl('button', {
			cls: 'style-saver',
			text: 'Save',
		});

		const content = await this.app.vault.adapter.read(`${this.app.vault.configDir}/snippets/${snippet_name.value}`)
		snippet_name.addEventListener("change", () => {
			if (path.files.contains(snippet_name.value)) {
				styles_area.value = content;
			}

		})

		btn.on('click', 'button', async () => {
			const path = `${this.app.vault.configDir}/snippets`;
			const adapter = this.app.vault.adapter;

			if (!(await adapter.exists(path))) {
				await adapter.mkdir(path);
			}

			if (snippet_name.value == '') {
				new Notice('Type the snippet name!!!', 1000);
				return;
			}

			if (select.value == 'append') {
				if (await adapter.exists(path)) {
					await adapter.append(path.normalize(), styles_area.value);
				} else {
					await adapter.write(path, styles_area.value);
				}
			} else {
				await adapter.write(path, styles_area.value);
			}
			
			new Notice('Snippet has been saved!', 3000);
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

	async refresh() {
		await this.refresh();
	}

	protected async onClose(): Promise<void> {}
}
