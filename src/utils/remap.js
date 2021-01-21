import {
  faMars,
  faVenus,
  faGenderless,
} from "@fortawesome/free-solid-svg-icons";

export function mapBreederSchema(object) {
  const {
    name,
    hp,
    atk,
    def,
    spa,
    spd,
    spe,
    nature,
    eggGroups,
    gender,
  } = object;
  const breederSchema = {
    name,
    ivs: {
      hp,
      atk,
      def,
      spa,
      spd,
      spe,
    },
    nature,
    gender,
    eggGroups,
  };
  return breederSchema;
}

function comparator(state, stat) {
  const { active, data } = state.data.target;
  if (active[stat]) {
    return data[stat];
  }
  return false;
}

export const genderIcons = {
  male: { icon: faMars, color: "rgb(90,193,254)" },
  female: { icon: faVenus, color: "rgb(255,108,226)" },
  genderless: { icon: faGenderless, color: "grey" },
};

export function convertToJSON(state) {
  const { target, breeders } = state.data;
  const stats = ["hp", "atk", "def", "spa", "spd", "spe"];
  const schema = {
    target: { name: target.data.name, ivs: {}, nature: target.data.nature },
    breeders: breeders,
  };
  stats.map((stat) => (schema.target.ivs[stat] = comparator(state, stat)));
  const result = JSON.stringify(schema);
  console.log("JSON:", result);
  return result;
}
