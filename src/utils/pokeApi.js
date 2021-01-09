import http from "../services/httpService";
const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

export async function getPoke(input) {
  return await http.get(`${apiUrl}${input}`);
}

export async function getImg(input) {
  if (!input) return;
  const poke = await getPoke(input);
  //   const spriteUrl = poke.data.sprites.front_default; GEN 3 SPRITE
  const spriteUrl =
    poke.data.sprites.versions["generation-v"]["black-white"].animated
      .front_default;
  if (spriteUrl === null) {
    return "blank";
  }
  return spriteUrl;
}

export async function getImgSm(input) {
  if (!input) return;
  const poke = await getPoke(input);
  const spriteUrl =
    poke.data.sprites.versions["generation-vii"].icons.front_default;
  if (spriteUrl === null) {
    return "blank";
  }
  return spriteUrl;
}

export async function getItemIcon(input) {
  console.log(input);
  const item = await http.get(`https://pokeapi.co/api/v2/item/${input}`);
  console.log("item:", item);
  const spriteUrl = item.data.sprites.default;
  return spriteUrl;
}

export async function getAllPokes() {
  return await http.get(`${apiUrl}?limit=649`);
}

export async function getNatures() {
  return await http.get(`https://pokeapi.co/api/v2/nature?limit=25`);
}
