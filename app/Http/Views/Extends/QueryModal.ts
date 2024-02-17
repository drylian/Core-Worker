import { render } from "@/Http/Structures/Responser";

export default function QueryModal(js: string, data: object) {
    /**
     * ALT QueryModal version HTML 
     */
    return (`
    function QueryModal({
        id = "results",
        data,
        search,
        children,
        setedPage,
        limit = 10
    }) {
        // Estados para gerenciar o estado da query, a página atual, a ativação do filtro,
        // a lista de resultados filtrados e os dados originais.
        let query = [];
        let currentPage = setedPage ? setedPage : 1;
        let activefilter = false;
        let queryed = [];
        const resultsPerPage = limit;

        // Efeito colateral para atualizar a query com base nos dados, termo de pesquisa e página atual.
        if (data) {
            const filteredData = data.filter(item =>
                JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
            );
            if (queryed.length === data.length && activefilter) currentPage = 1;
            activefilter = search !== "" && filteredData.length > 0;
            queryed = filteredData;
            const startIndex = (currentPage - 1) * resultsPerPage;
            const endIndex = startIndex + resultsPerPage;
            query = filteredData.slice(startIndex, endIndex);
        }

        // Cálculo do número total de páginas com base nos resultados por página e na lista filtrada.
        const totalPages = !activefilter
            ? Math.ceil(data.length / resultsPerPage)
            : Math.ceil(queryed.length / resultsPerPage);

        const appContainer = document.getElementById(id);

        // Renderizar children
        const childrenNode = children({ query });

        // Renderizar controles de navegação da página, exibidos apenas se houver mais de uma página.
        let pageControls = "";
        if (totalPages !== 1 && totalPages !== 0) {
            pageControls = ${render("`")}
            ${render("<ul class='flex-1 list-style-none flex p-2 items-center justify-center'>")}
            ${render("${totalPages !== 1 && currentPage !== 1 ? `")}
            <button
            onclick="setPage(-1)"
            ${render('${currentPage === 1 ? "disabled" : ""}')}
            class='relative block rounded-full corter px-3 py-1.5 text-sm textpri transition-all duration-300'
            >
            Anterior
            ${render('</button>` : ""}')}
            ${render("${queryed.length !== data.length ? `")}
            <span class='relative block rounded-full bg-transparent px-3 py-1.5 text-sm textsec transition-all duration-300'>
            ${render("${queryed.length} resultados encontrados, Página ${currentPage} de ${totalPages}")}
            ${render("</span>` : `")}
            <span class='relative block rounded-full bg-transparent px-3 py-1.5 text-sm textsec transition-all duration-300'>
            Página ${render("${currentPage}")} de ${render("${totalPages}")}
            </span>${render("`}")}
            ${render("${totalPages > currentPage ? `")}
            <button
            onclick="setPage(1)"
            ${render('${currentPage === totalPages ? "disabled" : ""}')}
            class='relative block rounded-full corter px-3 py-1.5 text-sm textpri transition-all duration-300'
            >
            Próxima
            ${render('</button>` : ""}')}
            ${render("</ul>`;")}
        }

        // Montar o conteúdo na div "app"
        appContainer.innerHTML = renderContent(childrenNode, pageControls);
        
        return { currentPage, totalPages };
    }

    function renderContent(childrenNode, pageControls) {
        return ${render("`${childrenNode}${pageControls}`")};
    }

    document.getElementById('searchInput').addEventListener('input', function (event) {
        const search = event.target.value;
        setSearch(search);
    });

    function setPage(page) {
        const data = QueryModal({
            data: ${JSON.stringify(data)},
            search: document.getElementById('searchInput').value,
            setedPage: page ? currentPage + page : undefined,
            children: ({ query }) => {
                // Função de renderização do conteúdo
                // Substitua isso com seu próprio código HTML/JS
                ${js}
            },
            limit: 10
        });

        currentPage = data.currentPage;
        totalPages = data.totalPages;
    }

    function setSearch(search) {
        setPage(0);
    }
    document.addEventListener('DOMContentLoaded', setPage(0));

`)
}