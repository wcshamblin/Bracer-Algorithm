import http from "../services/httpService";
const apiUrl = "https://pokeapi.co/api/v2";

export async function getPoke(input) {
  return await http.get(`${apiUrl}/pokemon/${input}`);
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
  const item = await http.get(`${apiUrl}/item/${input}`);
  const spriteUrl = item.data.sprites.default;
  return spriteUrl;
}

export async function getAllPokes() {
  return await http.get(`${apiUrl}/pokemon/?limit=649`);
}

export async function getNatures() {
  return await http.get(`${apiUrl}/nature?limit=25`);
}

export async function getEggGroup(num) {
  const { data } = await http.get(`${apiUrl}/egg-group/${num}`);
  return data;
}

export async function findEggGroup(input) {
  if (!input) return;
  const { data } = await getPoke(input);
  const { name } = data;
  const eggGroups = [];
  for (let i = 1; i < 16; i++) {
    const eggGroup = await getEggGroup(i);
    const names = eggGroup.pokemon_species.map((poke) => poke.name);
    const isIncluded = names.includes(name);
    if (isIncluded) {
      const newName = convertEggGroup(eggGroup.name);
      eggGroups.push(newName);
    }
  }
  console.log(eggGroups);
  return eggGroups;
}

function convertEggGroup(input) {
  const eggGroups = [
    { old: "monster", new: "monster" },
    { old: "water1", new: "water A" },
    { old: "bug", new: "bug" },
    { old: "flying", new: "flying" },
    { old: "ground", new: "field" },
    { old: "fairy", new: "fairy" },
    { old: "plant", new: "grass" },
    { old: "humanshape", new: "humanoid" },
    { old: "water3", new: "water C" },
    { old: "mineral", new: "mineral" },
    { old: "indeterminate", new: "chaos" },
    { old: "water2", new: "water B" },
    { old: "ditto", new: "ditto" },
    { old: "dragon", new: "dragon" },
    { old: "no-eggs", new: "cannot breed" },
    { old: "genderless", new: "genderless" },
  ];

  for (let i = 0; i < 16; i++) {
    input = input.replace(eggGroups[i].old, eggGroups[i].new);
  }
  return input;
}
