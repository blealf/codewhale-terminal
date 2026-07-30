import { Event, EventEmitter, TreeDataProvider, TreeItem } from 'vscode';

export class PlaceholderViewProvider implements TreeDataProvider<TreeItem> {
  private readonly emitter = new EventEmitter<TreeItem | null>();

  readonly onDidChangeTreeData: Event<TreeItem | null> = this.emitter.event;

  getTreeItem(element: TreeItem): TreeItem {
    return element;
  }

  getChildren(): TreeItem[] {
    return [];
  }

  getParent(): undefined {
    return undefined;
  }
}
