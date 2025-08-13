const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async () => {
  const { data, error } = await supabase.from('votes').select('*');

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }

  // Convert array to object for fast lookup
  const result = {};
  data.forEach(row => {
    result[row.id] = row.count;
  });

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
