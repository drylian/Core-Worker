const texto = `
<pre class="p-1"><span class="text-black dark:text-white duration-300">{</span>
  <span class="text-red-400 dark:text-red-500 duration-300">"requested":</span> 1707875556150<span class="text-black dark:text-white duration-300">,</span>
  <span class="text-red-400 dark:text-red-500 duration-300">"ended":</span> 1707875556173<span class="text-black dark:text-white duration-300">,</span>
  <span class="text-red-400 dark:text-red-500 duration-300">"delay":</span> <span class="text-yellow-400 dark:text-yellow-500 duration-300">"23ms"</span>
<span class="text-black dark:text-white duration-300">}</span></pre>
`;

// Remove todas as tags <span>
const regex = new RegExp('<span.*?<', 'g');

const textoSemSpan = texto.replace(regex, '').replace('class="p-1"', '');

// Extrai todos os números restantes
const numeros = textoSemSpan.match(/\d+/g);

console.log(numeros);
