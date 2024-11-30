import { RouteObject } from 'react-router-dom';
import { ComponentType } from 'react';

export type RouteProvider = () => RouteObject[];

/** Represents an application facet */
export interface ApplicationFacet {
  /** Uniquely identifies a facet */
  name: string;
  /** Router base path, if omitted, {@link name} will be used */
  basePath?: string;
  /** Indicates whether authorization is required */
  authorization?: boolean;
  /** Default display name, if omitted a localized name or {@link name} will be used */
  defaultDisplayName?: string;
  /** Category name */
  category?: string;
  /** Icon component for the facet */
  icon?: ComponentType | string | null;
  /** Returns sub-routes for the facet */
  routes: RouteProvider;
}
