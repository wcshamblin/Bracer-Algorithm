import axios from "axios";
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

export const cancelTokenSource = axios.CancelToken.source();

export async function getImgSm(input) {
  if (!input) return;
  const poke = await getPoke(input, { cancelToken: cancelTokenSource.token });
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

export async function getAllBraceIcons() {
  const braces = ["weight", "bracer", "belt", "lens", "band", "anklet"];
  const stats = ["hp", "atk", "def", "spa", "spd", "spe", "nature"];
  let urls = await Promise.all(
    braces.map(async (brace) => await getItemIcon(`power-${brace}`))
  );
  urls.push(await getItemIcon("everstone"));
  let braceObject = {};
  stats.map((stat, index) => (braceObject[stat] = urls[index]));
  return braceObject;
}

export async function getAllPokes() {
  return await http.get(`${apiUrl}/pokemon/?limit=649`);
}

export async function getNatures() {
  return await http.get(`${apiUrl}/nature?limit=25`);
}

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
];

export async function getEggGroup(group) {
  const { data } = await http.get(`${apiUrl}/egg-group/${group.old}`);
  return data;
}

export async function findEggGroup(input) {
  if (!input) return;
  const { data } = await getPoke(input);
  const { name } = data;
  const results = [];
  for await (const group of eggGroups) {
    const eggGroup = await getEggGroup(group);
    const names = eggGroup.pokemon_species.map((poke) => poke.name);
    const isIncluded = names.includes(name);
    if (isIncluded) {
      const newName = convertEggGroup(eggGroup.name);
      results.push(newName);
      if (results.length === 2) {
        return results;
      }
    }
  }
  return results;
}

function convertEggGroup(input) {
  eggGroups.forEach((group) => (input = input.replace(group.old, group.new)));
  return input;
}
