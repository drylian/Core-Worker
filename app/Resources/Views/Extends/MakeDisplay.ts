import { render } from "@/Http/Structures/Responser";

export function MakeDisplay(){
    return `
    function MakeTable(data) {
        let tableHtml = ${render("`")}
        ${render(`<div class="mx-auto">`)}
        ${render(`<div class="flex flex-col">`)}
        ${render(`<div class="overflow-x-auto shadow-md sm:rounded-lg">`)}
        ${render(`<div class="inline-block min-w-full align-middle">`)}
        ${render(`<div class="overflow-hidden ">`)}
        ${render(`<table class="duration-300 min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">`)}
        ${render(`<thead class="duration-300 bg-gray-100 dark:bg-gray-700">`)}
        ${render(`<tr>`)}
        ${render("`")};
        Object.keys(data[0]).forEach(key => {
          tableHtml += ${render("`")}<th scope="col" class="py-3 px-6 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400">${render("${key}")}</th>${render("`")};
        });
        tableHtml += '</tr></thead>';
        // Corpo da tabela com os valores dos objetos
        tableHtml += '<tbody class="duration-300 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">';
        data.forEach(obj => {
          tableHtml += '<tr class="duration-300 hover:bg-gray-100 dark:hover:bg-gray-700">';
          Object.values(obj).forEach(value => {
            if (typeof value == "object") {
              const stringValue = JSON.stringify(value);
              const id = stringValue.replaceAll('"', "").replaceAll('{', "").replaceAll('}', "").replaceAll('-', "").replaceAll('.', "").replaceAll(',', "").replaceAll(':', "").replaceAll(' ', "")
              tableHtml += ${render("`")}<td class="duration-300 py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <button class="duration-300 text-white ml-4 bg-blue-700 hover:bg-blue-800 font-bold rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center" type="button" data-dropdown-toggle="${render("${id}")}">
                  Ver</button>
                  <div class="hidden duration-300 dark:bg-slate-800 bg-gray-200  text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4" id="${render("${id}")}">
                    <p class="p-1">
                      ${render("${MakeDisplayer(value)}")}
                    </p>
                  </div>
                    </td>${render("`")};
            } else {
              tableHtml += ${render("`")}<td class="duration-300 py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">${render("${value}")}</td>${render("`")};
            }
          });
          tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table></div></div></div></div></div>';
        return tableHtml;
      }
  
      function MakeDisplayer(data) {
        // Iniciar a lista HTML
        let keyValueHtml = '<ul class="duration-300 text-gray-900 dark:text-white">';
  
        // Iterar sobre cada chave-valor do objeto
        Object.entries(data).forEach(([key, value]) => {
          // Se o valor for um objeto, chamar recursivamente MakeDisplayer
          if (typeof value === 'object') {
            keyValueHtml += ${render("`")}<li class="duration-300 m-1 rounded-lg bg-gray-200 dark:bg-slate-800 p-1"><span class="font-semibold dark:text-gray-400">${render("${key}")}: {</span>
          <div class="duration-300 rounded-lg bg-gray-200 dark:bg-slate-800 bg-opacity-40 p-1">${render("${MakeDisplayer(value)}")} </div>}</li>${render("`")};
          } else {
            // Adicionar a chave-valor à lista HTML, com formatação condicional para tipos específicos
            let formattedValue = value;
            if (typeof value === 'string') {
              formattedValue = ${render("`")}"${render("${value}")}"${render("`")}; // Adicione aspas para strings
            } else if (value === null) {
              formattedValue = 'null'; // Exibir null explicitamente
            }
            keyValueHtml += ${render("`")}<li><span class="duration-300 font-semibold">${render("${key}")}:</span> <span class="dark:text-gray-400">${render("${formattedValue}")}</span></li>${render("`")};
          }
        });
        // Fechar a lista HTML
        keyValueHtml += '</ul>';
        return keyValueHtml;
      }
  
  
  
      function displayData(data) {
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
          return MakeTable(data)
        } else if (typeof data === 'object') {
          return MakeDisplayer(data)
        } else {
          return ${render("`")}<pre>${render("${data}")}</pre>${render("`")}
        }
      }
      `
}