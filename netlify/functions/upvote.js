const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

exports.handler = async (event) => {
  const { id } = JSON.parse(event.body);

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing ID' }),
    };
  }

  // Check if logo already exists
  let { data, error } = await supabase
    .from('votes')
    .select('count')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }

  if (!data) {
    // Insert new logo vote
    await supabase.from('votes').insert({ id, count: 1 });
    return {
      statusCode: 200,
      body: JSON.stringify({ id, votes: 1 }),
    };
  } else {
    // Update count
    const newCount = data.count + 1;
    await supabase.from('votes').update({ count: newCount }).eq('id', id);
    return {
      statusCode: 200,
      body: JSON.stringify({ id, votes: newCount }),
    };
  }
};
