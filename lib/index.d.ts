export default function viteArtty(): {
    name: string;
    transform(code: string, id: string): import("@babel/core").BabelFileResult | null | undefined;
};
