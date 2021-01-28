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
  { old: "monster", new: "Monster" },
  { old: "water1", new: "Water A" },
  { old: "bug", new: "Bug" },
  { old: "flying", new: "Flying" },
  { old: "ground", new: "Field" },
  { old: "fairy", new: "Fairy" },
  { old: "plant", new: "Grass" },
  { old: "humanshape", new: "Humanoid" },
  { old: "water3", new: "Water C" },
  { old: "mineral", new: "Mineral" },
  { old: "indeterminate", new: "Chaos" },
  { old: "water2", new: "Water B" },
  { old: "ditto", new: "Ditto" },
  { old: "dragon", new: "Dragon" },
  { old: "no-eggs", new: "Cannot breed" },
];

const HyphenedPokes = [
  { old: "deoxys-normal", new: "deoxys" },
  { old: "wormadam-plant", new: "wormadam" },
  { old: "giratina-altered", new: "giratina" },
  { old: "shaymin-land", new: "shaymin" },
  { old: "basculin-red-striped", new: "basculin" },
  { old: "darmanitan-standard", new: "darmanitan" },
  { old: "tornadus-incarnate", new: "tornadus" },
  { old: "thundurus-incarnate", new: "thundurus" },
  { old: "landorus-incarnate", new: "landorus" },
  { old: "keldeo-ordinary", new: "keldeo" },
  { old: "meloetta-aria", new: "meloetta" },
];

function convertObjectProp(input, array) {
  array.forEach((group) => (input = input.replace(group.old, group.new)));
  return input;
}

export async function getPokemonSpecies(name) {
  const { data } = await http.get(
    `${apiUrl}/pokemon-species/${convertObjectProp(name, HyphenedPokes)}`
  );
  return data;
}

export async function findEggGroup(data) {
  if (!data) return;
  const newEggGroups = data.egg_groups.map((group) =>
    convertObjectProp(group.name, eggGroups)
  );
  return newEggGroups;
}

export async function getGenders(data) {
  if (!data) return;
  switch (data.gender_rate) {
    case -1:
      return ["genderless"];
    case 0:
      return ["male"];
    case 8:
      return ["female"];
    default:
      return ["male", "female"];
  }
}
