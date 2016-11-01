angular.module('apf.containers.dashboardModule').controller('containers.dashboardController2',
  ['$scope', 'ChartsDataMixin', 'DashboardUtils', '$translate', '$resource', '$timeout', '$window',
  function ( $scope, chartsDataMixin, dashboardUtils, $translate, $resource, $timeout, $window ) {
    'use strict';

    var dashboardWidgets = [
      {
        name: 'time',
        directive: 'wt-time'
      },
      {
        name: 'routesstatus-card',
        directive: 'pf-aggregate-status-card',
        attrs: {
          'status': 'objectStatus.routes',
          'url': 'navigation',
          'show-top-border': true,
          'layout': 'mini',
        },
        size: {
          width: '300px',
          height: '100px'
        }
      },
      {
        name: 'containers-card',
        directive: 'pf-aggregate-status-card',
        attrs: {
          'status': 'objectStatus.containers',
          'url': 'navigation',
          'show-top-border': true,
          'layout': 'mini',
        },
        size: {
          width: '300px',
          height: '100px'
        }
      },
      {
        name: 'registries-card',
        directive: 'pf-aggregate-status-card',
        attrs: {
          'status': 'objectStatus.registries',
          'url': 'navigation',
          'show-top-border': true,
          'layout': 'mini',
        },
        size: {
          width: '300px',
          height: '100px'
        }
      },
      {
        name: 'nodes-card',
        directive: 'pf-aggregate-status-card',
        attrs: {
          'status': 'objectStatus.nodes',
          'url': 'navigation',
          'show-top-border': true,
          'layout': 'mini',
        },
        size: {
          width: '300px',
          height: '100px'
        }
      },
      {
        name: 'projects-card',
        directive: 'pf-aggregate-status-card',
        attrs: {
          'status': 'objectStatus.projects',
          'url': 'navigation',
          'show-top-border': true,
          'layout': 'mini',
        },
        size: {
          width: '300px',
          height: '100px'
        }
      },
      {
        name: 'providers-card',
        directive: 'pf-aggregate-status-card',
        attrs: {
          'status': 'objectStatus.providers',
          'url': 'navigation',
          'show-top-border': true,
          'layout': 'tall',
        },

        size: {
          width: '300px',
          height: '100px'
        }
      },
      {
        name: 'node-utilization-heatmap',
        directive: 'heatmaps-card',
        attrs: {
          'card-title': "Node Utilization",
          'hidetopborder': true,
          'chart-data-available': 'nodeCpuUsage.loadingDone || nodeMemoryUsage.loadingDone',
          'heatmaps': 'heatmaps',
          'heatmap-chart-height': 'dashboardHeatmapChartHeight',
          'column-sizing-class': 'col-xs-8 col-sm-6 col-md-6',
          'heat-map-usage-legend-labels': 'nodeHeatMapUsageLegendLabels',
        },
        size: {
          width: '300px',
          height: '300px'
        }
      }
    ];

    var defaultWidgets = [
      { name: 'routesstatus-card' },
      { name: 'containers-card' },
      { name: 'registries-card' },
      { name: 'nodes-card' },
      { name: 'projects-card' },
      { name: 'providers-card' },
      { name: 'node-utilization-heatmap' },
    ];

    $scope.navigation = "containers";

    $scope.dashboardOptions = {
      widgetButtons: true,
      hideWidgetName: true,
      widgetDefinitions: dashboardWidgets,
      defaultWidgets: defaultWidgets,
      storage: $window.localStorage,
      storageId: 'demo_simple'
    };


    $scope.chartHeight = chartsDataMixin.dashboardSparklineChartHeight;
    $scope.dashboardHeatmapChartHeight = chartsDataMixin.dashboardHeatmapChartHeight;

    $scope.objectStatus = {
      providers:  dashboardUtils.createProvidersStatus(),
      nodes:      dashboardUtils.createNodesStatus(),
      containers: dashboardUtils.createContainersStatus(),
      registries: dashboardUtils.createRegistriesStatus(),
      projects:   dashboardUtils.createProjectsStatus(),
      pods:       dashboardUtils.createPodsStatus(),
      services:   dashboardUtils.createServicesStatus(),
      images:     dashboardUtils.createImagesStatus(),
      routes:     dashboardUtils.createRoutesStatus()
    };

    //Get the container data
    $resource('mock_data/containers/dashboard/status').get(function (response) {
      var data = response.data;
      var providers = data.providers;
      if (providers) {
        $scope.objectStatus.providers.count = providers.length;
        $scope.objectStatus.providers.notifications = [];
        providers.forEach(function (item) {
          $scope.objectStatus.providers.notifications.push({
            iconClass: item.iconClass,
            iconImage: item.iconImage,
            count: item.count,
            href: "#compute/containers/providers/?filter=" + item.providerType
          });
        });
      }
      dashboardUtils.updateStatus($scope.objectStatus.nodes, data.nodes);
      dashboardUtils.updateStatus($scope.objectStatus.containers, data.containers);
      dashboardUtils.updateStatus($scope.objectStatus.registries, data.registries);
      dashboardUtils.updateStatus($scope.objectStatus.projects, data.projects);
      dashboardUtils.updateStatus($scope.objectStatus.pods, data.pods);
      dashboardUtils.updateStatus($scope.objectStatus.services, data.services);
      dashboardUtils.updateStatus($scope.objectStatus.images, data.images);
      dashboardUtils.updateStatus($scope.objectStatus.routes, data.routes);
    });

    // Node Utilization

    $scope.cpuUsageConfig = chartConfig.cpuUsageConfig;
    $scope.cpuUsageSparklineConfig = {
      tooltipType: 'valuePerDay',
      chartId: 'cpuSparklineChart'
    };
    $scope.cpuUsageDonutConfig = {
      chartId: 'cpuDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };
    $scope.memoryUsageConfig = chartConfig.memoryUsageConfig;
    $scope.memoryUsageSparklineConfig = {
      tooltipType: 'valuePerDay',
      chartId: 'memorySparklineChart'
    };
    $scope.memoryUsageDonutConfig = {
      chartId: 'memoryDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };

    $scope.utilizationLoadingDone = false;
    $resource('mock_data/containers/dashboard/utilization').get(function (response) {
      $scope.cpuUsageData = chartsDataMixin.getCpuUsageDataFromResponse(response, $scope.cpuUsageConfig.usageDataName);
      $scope.memoryUsageData = chartsDataMixin.getMemoryUsageDataFromResponse(response, $scope.memoryUsageConfig.usageDataName);
      $scope.utilizationLoadingDone = true;
      $scope.cpuUsageData.dataAvailable = false;
      $scope.memoryUsageData.dataAvailable = false;
    });

    // Network Utilization

    $scope.networkUtilizationCurrentConfig = chartConfig.currentNetworkUsageConfig;
    $scope.networkUtilizationCurrentConfig.tooltipFn = chartsDataMixin.sparklineTimeTooltip;

    $scope.networkUtilizationDailyConfig = chartConfig.dailyNetworkUsageConfig;

    $scope.networkUtilizationLoadingDone = false;
    $resource('mock_data/containers/dashboard/utilization').get(function (response) {
      var data = response.data;
      $scope.currentNetworkUtilization = chartsDataMixin.getSparklineData(data.currentNetworkUsageData, $scope.networkUtilizationCurrentConfig.dataName, 60);
      chartsDataMixin.continuouslyUpdateData($scope.currentNetworkUtilization, 60 * 1000);
      $scope.dailyNetworkUtilization = chartsDataMixin.getSparklineData(data.dailyNetworkUsageData, $scope.networkUtilizationDailyConfig.dataName);
      $scope.networkUtilizationLoadingDone = true;
      $scope.currentNetworkUtilization.dataAvailable = false;
      $scope.dailyNetworkUtilization.dataAvailable = false;
    });

    $scope.podTrendConfig = chartConfig.podTrendConfig;
    $scope.podTrendsLoadingDone = false;

    $resource('mock_data/containers/dashboard/pods').get(function (response) {
      var data = response.data;
      $scope.podTrends = chartsDataMixin.getSparklineData(data.podTrends, $scope.podTrendConfig.dataName);
      $scope.podTrendsLoadingDone = true;
    });

    $scope.imageTrendConfig = chartConfig.imageTrendConfig;
    $scope.imageTrendLoadingDone = false;
    $resource('mock_data/containers/dashboard/image-trends').get(function (response) {
      var data = response.data;
      $scope.imageTrends = chartsDataMixin.getSparklineData(data.imageTrends, $scope.imageTrendConfig.dataName);
      $scope.imageTrendLoadingDone = true;
    });

    $scope.nodeCpuUsage = {
      title: 'CPU',
      id: 'nodeCpuUsageMap',
      loadingDone: false
    };
    $scope.nodeMemoryUsage = {
      title: 'Memory',
      id: 'nodeMemoryUsageMap',
      loadingDone: false
    };

    $scope.heatmaps = [$scope.nodeCpuUsage, $scope.nodeMemoryUsage];

    $resource('mock_data/containers/dashboard/node-cpu-usage').get(function (response) {
      var data = response.data;
      $scope.nodeCpuUsage.data = data.nodeCpuUsage;
      $scope.nodeCpuUsage.loadingDone = true;
    });

    $resource('mock_data/containers/dashboard/node-memory-usage').get(function (response) {
      var data = response.data;
      $scope.nodeMemoryUsage.data = data.nodeMemoryUsage;
      $scope.nodeMemoryUsage.loadingDone = true;
    });

    $scope.nodeHeatMapUsageLegendLabels = chartsDataMixin.nodeHeatMapUsageLegendLabels;
    $scope.nodeHeatmapDataAvailable = false;

    $timeout(function () {
      $scope.currentNetworkUtilization.dataAvailable = true;
      $scope.dailyNetworkUtilization.dataAvailable = true;
      $scope.cpuUsageData.dataAvailable = true;
      $scope.memoryUsageData.dataAvailable = true;
    }, 5000);
  }
])
  .directive('wtTime', function ($interval) {
    'use strict';
    return {
      restrict: 'A',
      scope: true,
      replace: true,
      template: '<div>Time<div class="alert alert-success">{{time}}</div></div>',
      link: function (scope) {
        function update () {
          scope.time = new Date().toLocaleTimeString();
        }

        update();

        var promise = $interval(update, 500);

        scope.$on('$destroy', function () {
          $interval.cancel(promise);
        });
      }
    };
  });
