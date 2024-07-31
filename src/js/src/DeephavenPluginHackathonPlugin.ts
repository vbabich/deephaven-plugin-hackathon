import { type WidgetPlugin, PluginType } from '@deephaven/plugin';
import { vsGraph } from '@deephaven/icons';
import { DeephavenPluginHackathonView } from './DeephavenPluginHackathonView';

// Register the plugin with Deephaven
export const DeephavenPluginHackathonPlugin: WidgetPlugin = {
  // The name of the plugin
  name: 'deephaven-plugin-hackathon',
  // The type of plugin - this will generally be WIDGET_PLUGIN
  type: PluginType.WIDGET_PLUGIN,
  // The supported types for the plugin. This should match the value returned by `name`
  // in DeephavenPluginHackathonType in deephaven_plugin_hackathon_type.py
  supportedTypes: 'DeephavenPluginHackathon',
  // The component to render for the plugin
  component: DeephavenPluginHackathonView,
  // The icon to display for the plugin
  icon: vsGraph,
};

export default DeephavenPluginHackathonPlugin;
