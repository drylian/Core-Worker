interface TesteType {
    teste: string;
}
class Teste<T> {
    constructor(public readonly data: T extends Required<TesteType> ? T : TesteType) {

    }
}
new Teste({ teste: "string" }).data //{ teste: string; }
new Teste({ teste: "string" } as const).data //{ readonly teste: "string"; }