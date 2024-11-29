import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';

import {
  ResultComponent,
  SettingsListComponent,
  FeedbackComponent,
  CameraComponent,
  ControlsComponent,
  GesturesComponent,
  LogoComponent,
  OverlayComponent,
  PointOfInterestComponent,
  ScanAreaComponent,
  ViewfinderComponent,
  LocationSelectionComponent,
  SymbologiesComponent,
  SymbologyComponent,
  CodeDuplicateFilterComponent, CompositeTypesComponent,
} from './components';

import {
  mainNavigationItems,
  barcodeCaptureNavigationItems,
  NavigationLabel,
  NavigationRoute,
  viewNavigationItems,
  SettingsFieldName,
} from '../config';
import { UnitNumberComponent } from './components/unit-number/unit-number.component';

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
        component: SettingsListComponent,
        data: {
          items: mainNavigationItems,
          label: NavigationLabel.SETTINGS,
        }
      },
      {
        path: NavigationRoute.BARCODE_CAPTURE,
        children: [
          {
            path: '',
            component: SettingsListComponent,
            data: {
              items: barcodeCaptureNavigationItems,
              label: NavigationLabel.BARCODE_CAPTURE,
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
            path: NavigationRoute.LOCATION_SELECTION,
            children: [
              {
                path: '',
                component: LocationSelectionComponent,
                data: {
                  label: NavigationLabel.LOCATION_SELECTION,
                }
              },
              {
                path: NavigationRoute.LOCATION_SELECTION_WIDTH,
                component: UnitNumberComponent,
                data: {
                  form: 'locationSelectionForm',
                  label: NavigationLabel.LOCATION_SELECTION_WIDTH,
                  fieldName: SettingsFieldName.LOCATION_SELECTION_WIDTH,
                },
              },
              {
                path: NavigationRoute.LOCATION_SELECTION_HEIGHT,
                component: UnitNumberComponent,
                data: {
                  form: 'locationSelectionForm',
                  label: NavigationLabel.LOCATION_SELECTION_HEIGHT,
                  fieldName: SettingsFieldName.LOCATION_SELECTION_HEIGHT,
                },
              },
              {
                path: NavigationRoute.LOCATION_SELECTION_SIZE,
                component: UnitNumberComponent,
                data: {
                  form: 'locationSelectionForm',
                  label: NavigationLabel.LOCATION_SELECTION_SIZE,
                  fieldName: SettingsFieldName.LOCATION_SELECTION_SIZE,
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
            path: NavigationRoute.COMPOSITE_TYPES,
            component: CompositeTypesComponent,
            data: {
              label: NavigationLabel.COMPOSITE_TYPES,
            }
          }

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
            path: NavigationRoute.CONTROLS,
            component: ControlsComponent,
            data: {
              label: NavigationLabel.CONTROLS,
            }
          },
          {
            path: NavigationRoute.GESTURES,
            component: GesturesComponent,
            data: {
              label: NavigationLabel.GESTURES,
            }
          },
          {
            path: NavigationRoute.LOGO,
            children: [
              {
                path: '',
                component: LogoComponent,
                data: {
                  label: NavigationLabel.LOGO,
                }
              },
              {
                path: NavigationRoute.LOGO_X,
                component: UnitNumberComponent,
                data: {
                  form: 'logoForm',
                  label: NavigationLabel.LOGO_X,
                  fieldName: SettingsFieldName.LOGO_X,
                },
              },
              {
                path: NavigationRoute.LOGO_Y,
                component: UnitNumberComponent,
                data: {
                  form: 'logoForm',
                  label: NavigationLabel.LOGO_Y,
                  fieldName: SettingsFieldName.LOGO_Y,
                },
              },
            ]
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
              {
                path: NavigationRoute.VIEWFINDER_WIDTH,
                component: UnitNumberComponent,
                data: {
                  form: 'viewfinderForm',
                  label: NavigationLabel.VIEWFINDER_WIDTH,
                  fieldName: SettingsFieldName.VIEWFINDER_WIDTH,
                },
              },
              {
                path: NavigationRoute.VIEWFINDER_HEIGHT,
                component: UnitNumberComponent,
                data: {
                  form: 'viewfinderForm',
                  label: NavigationLabel.VIEWFINDER_HEIGHT,
                  fieldName: SettingsFieldName.VIEWFINDER_HEIGHT,
                },
              },
            ]
          }
        ],
      },
      {
        path: NavigationRoute.RESULT,
        component: ResultComponent,
        data: {
          label: NavigationLabel.RESULT,
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
