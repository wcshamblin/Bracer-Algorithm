export function mapBreederSchema(object) {
  const { name, hp, atk, def, spa, spd, spe, nature, eggGroups } = object;
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
