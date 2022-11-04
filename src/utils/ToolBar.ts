import { reactive } from 'vue';

export const lefttoolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save | customToolbar1"

//自定义工具栏
export const toolbar = reactive({
    customToolbar1: {
        title: '提示工具栏',
        icon: 'v-md-icon-tip',
        menus: [
            {
                name: 'menu1',
                text: '提示',
                action(editor) {
                    editor.insert(function (selected) {
                        const prefix = '::: tip\n';
                        const placeholder = '提示\n';
                        const suffix = ':::\n';
                        const content = selected || placeholder;

                        return {
                            text: `${prefix}${content}${suffix}`,
                            selected: content,
                        };
                    });
                },
            },
            {
                name: 'menu2',
                text: '警告',
                action(editor) {
                    editor.insert(function (selected) {
                        const prefix = '::: warning\n';
                        const placeholder = '警告\n';
                        const suffix = ':::\n';
                        const content = selected || placeholder;

                        return {
                            text: `${prefix}${content}${suffix}`,
                            selected: content,
                        };
                    });
                },
            },
            {
                name: 'menu3',
                text: '危险警告',
                action(editor) {
                    editor.insert(function (selected) {
                        const prefix = '::: danger\n';
                        const placeholder = '危险警告\n';
                        const suffix = ':::\n';
                        const content = selected || placeholder;

                        return {
                            text: `${prefix}${content}${suffix}`,
                            selected: content,
                        };
                    });
                },
            },
            {
                name: 'menu4',
                text: '详情块',
                action(editor) {
                    editor.insert(function (selected) {
                        const prefix = '::: details\n';
                        const placeholder = '详情块，可能在 IE / Edge 中不生效\n';
                        const suffix = ':::\n';
                        const content = selected || placeholder;

                        return {
                            text: `${prefix}${content}${suffix}`,
                            selected: content,
                        };
                    });
                },
            },
            {
                name: 'menu5',
                text: '自定义标题',
                action(editor) {
                    editor.insert(function (selected) {
                        const prefix = '::: tip 自定义标题\n';
                        const placeholder = '自定义标题(自由更改)\n';
                        const suffix = ':::\n';
                        const content = selected || placeholder;

                        return {
                            text: `${prefix}${content}${suffix}`,
                            selected: content,
                        };
                    });
                },
            },
            {
                name: 'menu6',
                text: '自定义标题2',
                action(editor) {
                    editor.insert(function (selected) {
                        const prefix = '::: danger STOP\n';
                        const placeholder = '自定义标题(自由更改)\n';
                        const suffix = ':::\n';
                        const content = selected || placeholder;

                        return {
                            text: `${prefix}${content}${suffix}`,
                            selected: content,
                        };
                    });
                },
            },
        ],
    },
})