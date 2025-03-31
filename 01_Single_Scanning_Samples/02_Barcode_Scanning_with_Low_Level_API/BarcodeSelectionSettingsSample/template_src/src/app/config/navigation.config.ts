import { NavigationLabel } from './labels.config';
import { NavigationRoute } from './routes.config';

export interface NavigationItem {
  label: string;
  route: string;
  children: NavigationItem[];
}

export const barcodeSelectionNavigationItems = [
  {
    label: NavigationLabel.SYMBOLOGIES,
    route: NavigationRoute.SYMBOLOGIES,
  },
  {
    label: NavigationLabel.SELECTION_TYPE,
    route: NavigationRoute.SELECTION_TYPE,
  },
  {
    label: NavigationLabel.FEEDBACK,
    route: NavigationRoute.FEEDBACK,
  },
  {
    label: NavigationLabel.CODE_DUPLICATE_FILTER,
    route: NavigationRoute.CODE_DUPLICATE_FILTER,
  },
  {
    label: NavigationLabel.SINGLE_BARCODE_AUTO_DETECTION,
    route: NavigationRoute.SINGLE_BARCODE_AUTO_DETECTION,
  },
  {
    label: NavigationLabel.BS_POINT_OF_INTEREST,
    route: NavigationRoute.BS_POINT_OF_INTEREST,
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
];

export const mainNavigationItems = [
  {
    label: NavigationLabel.BARCODE_SELECTION,
    route: NavigationRoute.BARCODE_SELECTION,
    children: barcodeSelectionNavigationItems,
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
];

export const mainNavigation = {
  label: NavigationLabel.SETTINGS,
  items: mainNavigationItems,
};
