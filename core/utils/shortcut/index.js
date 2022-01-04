import shortcut from './shortcut';

export function addShortcut(shortcutConfig) {
    shortcutConfig.forEach((config) => {
        config.keyboardShortcut.forEach((code) => {
            shortcut.add(code, config.action, {
                type: config.type || 'keydown',
                propagate: config.propagate,
                target: config.target,
                hasDefaultInput: false, // target里默认有input
            });
        });
    });
}