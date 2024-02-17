import { Request } from "express";
import { render } from "@/Http/Structures/Responser";
import { LightJson } from "./Extends/LightJson";
import { MakeDisplay } from "./Extends/MakeDisplay"
import QueryModal from "./Extends/QueryModal"
import { PartialsHeader } from "./Partials/Header.html";
import { PartialsTheme } from "./Partials/Theme.javascript";
import I18alt from "@/Controllers/Languages";
import { Internal } from "@/Controllers/Storage";

export function JsonHtml(data: object,req:Request) {
  /**
   * Usar argumento query ao invés de data
   */
  let Query = false;
  let queryLogic;
  const i18n = new I18alt();
  if (Array.isArray(data)) {
    Query = true
    queryLogic = QueryModal(`
        if(currentTYPE === 0){
          const jsondata = ${render("`")}<pre class="p-1">${render("${syntaxHighlight(JSON.stringify(query,null,2))}")}</pre>${render("`")}
          return jsondata
        } else {
          return displayData(query);
        }
        `, data);
  } else {
    queryLogic = `
        const data = ${JSON.stringify(data)}
        const Container = document.getElementById("results");
        if(currentTYPE === 0){
          Container.innerHTML = ${render("`")}<pre class="p-1">${render("${syntaxHighlight(JSON.stringify(data,null,2))}")}</pre>${render("`")}
        } else {
          Container.innerHTML = displayData(data);
        }
        `;
  }

  return `
    ${PartialsHeader()}
    <div class="flex justify-center center" id="preloader" style="background-image: linear-gradient(0deg, #1B1C1F, #222630);">
    <div id="status">
      <div class="flex justify-center" id="preloader">
        <div class="loading fixed top-0 left-0 w-full h-full bg-black z-50 flex justify-center items-center">
          <div class="loading bg-gray-100 dark:bg-black">
            <div class="loading-text">
              <span class="loading-text-words font-bold text-blue-900 dark:text-blue-400">L</span>
              <span class="loading-text-words font-bold text-blue-900 dark:text-blue-400">O</span>
              <span class="loading-text-words font-bold text-blue-900 dark:text-blue-400">A</span>
              <span class="loading-text-words font-bold text-blue-900 dark:text-blue-400">D</span>
              <span class="loading-text-words font-bold text-blue-900 dark:text-blue-400">I</span>
              <span class="loading-text-words font-bold text-blue-900 dark:text-blue-400">N</span>
              <span class="loading-text-words font-bold text-blue-900 dark:text-blue-400">G</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container mx-auto p-8">
    <div class="flex items-center">
      <img class="h-16 w-16 rounded-full" src="${Internal.get("core:logo")}">
      <div class="flex-1 flex-row items-center justify-between md:flex">
        <div class="flex-1">
          <h2 class="font-bold ml-2 text-black dark:text-white duration-300">${i18n.t("routes:names." + req.core.route?.name ?? "undefined")}</h2>
          <h4 class="font-semibold ml-2 text-slate-800 dark:text-slate-400 duration-300">${i18n.t("routes:comments." + req.core.route?.comment ?? "undefined")}</h4>
          <div class="flex items-center text-slate-400 dark:text-slate-500 duration-300">
            <i class="ml-2 bx bx-timer text-[15px]"></i>
            <p class="text-sm font-semibold items-center">${req.core.ping ? (Date.now() - req.core.ping ) /1000: "???.?"}s</p>
          </div>
        </div>
        ${Query ? `<div><input type='text' placeholder='Pesquisar...' value="" id='searchInput' class='block p-2 w-full text-sm textpri corsec border duration-200 border-none rounded focus:border-blue-500' /></div>`: ""}
      </div>
    </div>
    <div class="dark:bg-slate-600 bg-gray-300 p-2 m-1 rounded-lg shadow-md mt-2">
      <div class="ml-2 flex items-center">
      <button id="Viewer" onclick="SetViewer(1)" class="m-0.5 z-10 bg-green-500 dark:bg-green-600 text-white duration-300 p-2 rounded-t-lg">Viewer</button>
      <button id="JsonType" onclick="SetViewer(0)" class="m-0.5 z-10 bg-gray-400 dark:bg-gray-700 text-gray-300 dark:text-gray-200 duration-300 p-2 rounded-t-lg">Json</button>
      </div>
      <div class="dark:bg-slate-500 bg-gray-100 shadow-md p-1 rounded-lg overflow-hidden" id="results"></div>
    </div>
  </div>
  <script>
    let currentTYPE = 1
    const ViewerButton = document.getElementById('Viewer');
    const JsonButton = document.getElementById('JsonType');
        ${LightJson()}
        ${PartialsTheme()}
        ${MakeDisplay()}
        ${queryLogic}
        function SetViewer(type) {
          const ViewerButton = document.getElementById('Viewer');
          const JsonButton = document.getElementById('JsonType');
          const resultsDiv = document.getElementById('results');
        
          if (type === 0) {
            // Se o tipo for 0 (Json), atualize as cores dos botões e exiba o JSON
            resultsDiv.innerHTML = ${render("`")}<pre class="p-1">${render("${syntaxHighlight(JSON.stringify(data,null,2))}")}</pre>${render("`")};
            
            JsonButton.classList.remove('bg-gray-400', 'dark:bg-slate-400', 'text-slate-300', 'dark:text-slate-200');
            JsonButton.classList.add('bg-green-500', 'dark:bg-green-600', 'text-white');
            
            ViewerButton.classList.remove('bg-green-500', 'dark:bg-green-600', 'text-white');
            ViewerButton.classList.add('bg-gray-400', 'dark:bg-gray-700', 'text-gray-300', 'dark:text-gray-200');
          } else {
            // Se o tipo for 1 (Viewer), atualize as cores dos botões e exiba os resultados
            resultsDiv.innerHTML = displayData(data);
            
            ViewerButton.classList.remove('bg-gray-400', 'dark:bg-gray-700', 'text-gray-300', 'dark:text-gray-200');
            ViewerButton.classList.add('bg-green-500', 'dark:bg-green-600', 'text-white');
            
            JsonButton.classList.remove('bg-green-500', 'dark:bg-green-600', 'text-white');
            JsonButton.classList.add('bg-gray-400', 'dark:bg-gray-700', 'text-gray-300', 'dark:text-gray-200');
          }
        }        
    </script>
    <script>
    $(window).on('load', function() {
      $('#status').delay(600).fadeOut();
      $('#preloader').delay(350).fadeOut('slow');
      $('body').delay(350).css({
        'overflow': 'visible'
      });
    });
  </script>
    `;
}
