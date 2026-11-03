# Ticket 08: MarkerCluster Spiderfying & Heatmap

## Goal
Solve visual overlap in dense informal vendor hubs (such as Chappan Dukan with 56 food stalls within a 150m strip) and visualize vendor concentration.

## Scope
- Integrate `leaflet.markercluster` with custom badge styling.
- Spiderfy grouped vendors at street-level zoom (zoom 18).
- Toggleable density heatmap overlay using `leaflet.heat` derived from vendor coordinate clusters.

## Acceptance Criteria
- [x] Dense clusters expand into interactive spider legs at zoom 18.
- [x] Heatmap toggle smoothly transitions between pin view and density gradient.
- [x] Meets PAC-14.
