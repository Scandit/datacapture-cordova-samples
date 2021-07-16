import { NavigationRoute } from './routes.config';
import { NavigationLabel } from './labels.config';

export interface NavigationItem {
  label: string;
  route: string;
  children: NavigationItem[];
}

export const barcodeCaptureNavigationItems = [
  {
    label: NavigationLabel.SYMBOLOGIES,
    route: NavigationRoute.SYMBOLOGIES,
  },
  {
    label: NavigationLabel.COMPOSITE_TYPES,
    route: NavigationRoute.COMPOSITE_TYPES,
  },
  {
    label: NavigationLabel.LOCATION_SELECTION,
    route: NavigationRoute.LOCATION_SELECTION,
  },
  {
    label: NavigationLabel.FEEDBACK,
    route: NavigationRoute.FEEDBACK,
  },
  {
    label: NavigationLabel.CODE_DUPLICATE_FILTER,
    route: NavigationRoute.CODE_DUPLICATE_FILTER,
  },
];

export const viewNavigationItems = [
  {
    label: NavigationLabel.SCAN_AREA,
    route: NavigationRoute.SCAN_AREA,
  },
  {
    label: NavigationLabel.POINT_OF_INTEREST,
    route: NavigationRoute.POINT_OF_INTEREST,
  },
  {
    label: NavigationLabel.OVERLAY,
    route: NavigationRoute.OVERLAY,
  },
  {
    label: NavigationLabel.VIEWFINDER,
    route: NavigationRoute.VIEWFINDER,
  },
  {
    label: NavigationLabel.LOGO,
    route: NavigationRoute.LOGO,
  },
  {
    label: NavigationLabel.GESTURES,
    route: NavigationRoute.GESTURES,
  },
  {
    label: NavigationLabel.CONTROLS,
    route: NavigationRoute.CONTROLS,
  },
];

export const mainNavigationItems = [
  {
    label: NavigationLabel.BARCODE_CAPTURE,
    route: NavigationRoute.BARCODE_CAPTURE,
    children: barcodeCaptureNavigationItems,
  },
  {
    label: NavigationLabel.CAMERA,
    route: NavigationRoute.CAMERA,
  },
  {
    label: NavigationLabel.VIEW,
    route: NavigationRoute.VIEW,
    children: viewNavigationItems,
  },
  {
    label: NavigationLabel.RESULT,
    route: NavigationRoute.RESULT,
  },
];

export const mainNavigation = {
  label: NavigationLabel.SETTINGS,
  items: mainNavigationItems,
};
