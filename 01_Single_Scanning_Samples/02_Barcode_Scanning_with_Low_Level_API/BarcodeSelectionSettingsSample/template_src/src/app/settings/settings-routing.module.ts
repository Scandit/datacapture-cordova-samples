import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  barcodeSelectionNavigationItems,
  mainNavigationItems,
  NavigationLabel,
  NavigationRoute,
  SettingsFieldName,
  viewNavigationItems,
} from '../config';
import { FlatSelectComponent } from '../shared/controls';
import {
  BSPointOfInterestComponent,
  CameraComponent,
  CodeDuplicateFilterComponent,
  FeedbackComponent,
  MainSettingsComponent,
  OverlayComponent,
  PointOfInterestComponent,
  ScanAreaComponent,
  SelectionTypeComponent,
  SettingsListComponent,
  SingleBarcodeAutoDetectionComponent,
  SymbologiesComponent,
  SymbologyComponent,
  UnitNumberComponent,
  ViewfinderComponent,
} from './components';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    data: {
      label: NavigationLabel.SETTINGS,
    },
    children: [
      {
        path: '',
        component: MainSettingsComponent,
        data: {
          items: mainNavigationItems,
          label: NavigationLabel.SETTINGS,
        }
      },
      {
        path: NavigationRoute.BARCODE_SELECTION,
        children: [
          {
            path: '',
            component: SettingsListComponent,
            data: {
              items: barcodeSelectionNavigationItems,
              label: NavigationLabel.BARCODE_SELECTION,
            }
          },
          {
            path: NavigationRoute.SYMBOLOGIES,
            children: [
              {
                path: '',
                component: SymbologiesComponent,
                data: {
                  label: NavigationLabel.SYMBOLOGIES,
                }
              },
              {
                path: ':symbology',
                component: SymbologyComponent,
              },
            ],
          },
          {
            path: NavigationRoute.BS_POINT_OF_INTEREST,
            children: [
              {
                path: '',
                component: BSPointOfInterestComponent,
                data: {
                  form: 'barcodeSelectionPointOfInterestForm',
                  label: NavigationLabel.BS_POINT_OF_INTEREST,
                }
              },
              {
                path: NavigationRoute.BS_POINT_OF_INTEREST_X,
                component: UnitNumberComponent,
                data: {
                  form: 'barcodeSelectionPointOfInterestForm',
                  label: NavigationLabel.BS_POINT_OF_INTEREST_X,
                  fieldName: SettingsFieldName.BS_POINT_OF_INTEREST_X,
                },
              },
              {
                path: NavigationRoute.BS_POINT_OF_INTEREST_Y,
                component: UnitNumberComponent,
                data: {
                  form: 'barcodeSelectionPointOfInterestForm',
                  label: NavigationLabel.BS_POINT_OF_INTEREST_Y,
                  fieldName: SettingsFieldName.BS_POINT_OF_INTEREST_Y,
                },
              },
            ]
          },
          {
            path: NavigationRoute.SELECTION_TYPE,
            children: [
              {
                path: '',
                component: SelectionTypeComponent,
                data: {
                  label: NavigationLabel.SELECTION_TYPE,
                }
              },
              {
                path: NavigationRoute.SELECTION_TYPE,
                component: FlatSelectComponent,
                data: {
                  form: 'selectionTypeForm',
                  label: NavigationLabel.SELECTION_TYPE,
                  fieldName: SettingsFieldName.SELECTION_TYPE,
                },
              },
              {
                path: NavigationRoute.FREEZE_BEHAVIOUR,
                component: FlatSelectComponent,
                data: {
                  form: 'selectionTypeForm',
                  label: NavigationLabel.FREEZE_BEHAVIOUR,
                  fieldName: SettingsFieldName.FREEZE_BEHAVIOUR,
                },
              },
              {
                path: NavigationRoute.TAP_BEHAVIOUR,
                component: FlatSelectComponent,
                data: {
                  form: 'selectionTypeForm',
                  label: NavigationLabel.TAP_BEHAVIOUR,
                  fieldName: SettingsFieldName.TAP_BEHAVIOUR,
                },
              },
              {
                path: NavigationRoute.SELECTION_STRATEGY,
                component: FlatSelectComponent,
                data: {
                  form: 'selectionTypeForm',
                  label: NavigationLabel.SELECTION_STRATEGY,
                  fieldName: SettingsFieldName.SELECTION_STRATEGY,
                },
              },
            ],
          },
          {
            path: NavigationRoute.FEEDBACK,
            component: FeedbackComponent,
            data: {
              label: NavigationLabel.FEEDBACK,
            }
          },
          {
            path: NavigationRoute.CODE_DUPLICATE_FILTER,
            component: CodeDuplicateFilterComponent,
            data: {
              label: NavigationLabel.CODE_DUPLICATE_FILTER,
            }
          },
          {
            path: NavigationRoute.SINGLE_BARCODE_AUTO_DETECTION,
            component: SingleBarcodeAutoDetectionComponent,
            data: {
              label: NavigationLabel.SINGLE_BARCODE_AUTO_DETECTION,
            }
          },
        ]
      },
      {
        path: NavigationRoute.CAMERA,
        component: CameraComponent,
        data: {
          label: NavigationLabel.CAMERA,
        }
      },
      {
        path: NavigationRoute.VIEW,
        children: [
          {
            path: '',
            component: SettingsListComponent,
            data: {
              items: viewNavigationItems,
              label: NavigationLabel.VIEW,
            },
          },
          {
            path: NavigationRoute.OVERLAY,
            component: OverlayComponent,
            data: {
              label: NavigationLabel.OVERLAY,
            }
          },
          {
            path: NavigationRoute.POINT_OF_INTEREST,
            children: [
              {
                path: '',
                component: PointOfInterestComponent,
                data: {
                  form: 'pointOfInterestForm',
                  label: NavigationLabel.POINT_OF_INTEREST,
                }
              },
              {
                path: NavigationRoute.POINT_OF_INTEREST_X,
                component: UnitNumberComponent,
                data: {
                  form: 'pointOfInterestForm',
                  label: NavigationLabel.POINT_OF_INTEREST_X,
                  fieldName: SettingsFieldName.POINT_OF_INTEREST_X,
                },
              },
              {
                path: NavigationRoute.POINT_OF_INTEREST_Y,
                component: UnitNumberComponent,
                data: {
                  form: 'pointOfInterestForm',
                  label: NavigationLabel.POINT_OF_INTEREST_Y,
                  fieldName: SettingsFieldName.POINT_OF_INTEREST_Y,
                },
              },
            ]
          },
          {
            path: NavigationRoute.SCAN_AREA,
            children: [
              {
                path: '',
                component: ScanAreaComponent,
                data: {
                  label: NavigationLabel.SCAN_AREA,
                }
              },
              {
                path: NavigationRoute.SCAN_AREA_MARGIN_TOP,
                component: UnitNumberComponent,
                data: {
                  form: 'scanAreaForm',
                  label: NavigationLabel.SCAN_AREA_MARGIN_TOP,
                  fieldName: SettingsFieldName.SCAN_AREA_MARGIN_TOP,
                },
              },
              {
                path: NavigationRoute.SCAN_AREA_MARGIN_RIGHT,
                component: UnitNumberComponent,
                data: {
                  form: 'scanAreaForm',
                  label: NavigationLabel.SCAN_AREA_MARGIN_RIGHT,
                  fieldName: SettingsFieldName.SCAN_AREA_MARGIN_RIGHT,
                },
              },
              {
                path: NavigationRoute.SCAN_AREA_MARGIN_BOTTOM,
                component: UnitNumberComponent,
                data: {
                  form: 'scanAreaForm',
                  label: NavigationLabel.SCAN_AREA_MARGIN_BOTTOM,
                  fieldName: SettingsFieldName.SCAN_AREA_MARGIN_BOTTOM,
                },
              },
              {
                path: NavigationRoute.SCAN_AREA_MARGIN_LEFT,
                component: UnitNumberComponent,
                data: {
                  form: 'scanAreaForm',
                  label: NavigationLabel.SCAN_AREA_MARGIN_LEFT,
                  fieldName: SettingsFieldName.SCAN_AREA_MARGIN_LEFT,
                },
              }
            ]

          },
          {
            path: NavigationRoute.VIEWFINDER,
            children: [
              {
                path: '',
                component: ViewfinderComponent,
                data: {
                  label: NavigationLabel.VIEWFINDER,
                }
              },
            ]
          }
        ],
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
