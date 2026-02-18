import { AfterViewInit, Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { expanded } from '../../animations/expanded.animation';
import { IconComponent } from '../icon/icon.component';
import { TreeItem } from './tree-item.model';

/**
 * Component for representig tree structure.
 * Animations can cause flickering during initialization (entire tree is expanded for a moment). Therefore, timeout of 200ms. @see {renderingTimeoutMs} is added.
 * Adapted from material example @link https://v18.material.angular.dev/components/tree/examples#tree-nested-child-accessor-overview
 */
@Component({
  selector: 'eco-tree',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, IconComponent],
  animations: [expanded],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss',
})
export class TreeComponent<T extends TreeItem> implements AfterViewInit {
  dataSource = input<T[]>([]);
  hasViewInitialized = signal(false);
  renderingTimeoutMs = 200;

  ngAfterViewInit(): void {
    setTimeout(() => this.hasViewInitialized.set(true), this.renderingTimeoutMs);
  }

  childrenAccessor = (node: TreeItem) => node.children ?? [];

  hasChild = (_: number, node: TreeItem) => !!node.children && node.children.length > 0;
}
