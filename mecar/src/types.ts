export type TipoFonte = {
    id_tipo_fonte: number;
    nome: string;
  }
  
  export type Emissao = {
    id_emissao: number;
    tipo_fonte: TipoFonte;
    emissao: number;
  }
  
  export type Estatisticas = {
    max: Emissao | null;
    min: Emissao | null;
    avg: number | null;
  }
  