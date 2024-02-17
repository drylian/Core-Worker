
export function LightJson() {
    return `
    function syntaxHighlight(json) {
        // stringsjson
        json = json.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g,
            function (match) {
                let color = 'text-yellow-400 dark:text-yellow-400';
                if (/:$/.test(match)) {
                    color = 'text-zinc-400 dark:text-zinc-800';
                }
                return '<span class="' + color + ' duration-300">' + match + '</span>';
            }
        );
        // booleans
        json = json.replace(
            /\b(true|false)\b/g,
            '<span class="text-green-700 dark:text-green-400 duration-300">$1</span>'
        );
        // nulos
        json = json.replace(
            /\bnull\b/g,
            '<span class="text-cyan-700 dark:text-cyan-400 duration-300">null</span>'
        );
        json = json.replaceAll(",", ' ,');
        json = json.replaceAll(" ,", '<span class="text-black dark:text-white duration-300" >,</span>');
        json = json.replaceAll("{", '<span class="text-black dark:text-white duration-300" >{</span>');
        json = json.replaceAll("}", '<span class="text-black dark:text-white duration-300" >}</span>');
        json = json.replaceAll("[", '<span class="text-black dark:text-white duration-300" >[</span>');
        json = json.replaceAll("]", '<span class="text-black dark:text-white duration-300" >]</span>');
        json = '<div class="text-blue-700 dark:text-blue-400 duration-300">'+ json +'</div>'
        return json
    }
    `
}