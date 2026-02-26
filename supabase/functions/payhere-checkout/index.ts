import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { order_id, amount, currency, first_name, last_name, email, phone, address, city, items_description } = await req.json()

    // Create service role client to read payment_config
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get payment config
    const { data: config, error: configError } = await supabase
      .from('payment_config')
      .select('*')
      .limit(1)
      .single()

    if (configError || !config) {
      return new Response(JSON.stringify({ error: 'Payment not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const isSandbox = config.mode === 'sandbox'
    const merchant_id = isSandbox ? config.sandbox_merchant_id : config.live_merchant_id
    const merchant_secret = isSandbox ? config.sandbox_merchant_secret : config.live_merchant_secret

    if (!merchant_id || !merchant_secret) {
      return new Response(JSON.stringify({ error: 'PayHere credentials not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Generate hash per PayHere spec:
    // md5(merchant_id + order_id + amountFormatted + currency + md5(merchant_secret).toUpperCase())
    const encoder = new TextEncoder()

    // MD5 of merchant_secret
    const secretHash = await crypto.subtle.digest('MD5', encoder.encode(merchant_secret))
    const secretHashHex = Array.from(new Uint8Array(secretHash)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()

    // Format amount to 2 decimal places
    const amountFormatted = parseFloat(amount).toFixed(2)

    // Final hash
    const hashInput = merchant_id + order_id + amountFormatted + currency + secretHashHex
    const finalHash = await crypto.subtle.digest('MD5', encoder.encode(hashInput))
    const hash = Array.from(new Uint8Array(finalHash)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()

    const payment_url = isSandbox ? 'https://sandbox.payhere.lk/pay/checkout' : 'https://www.payhere.lk/pay/checkout'

    return new Response(JSON.stringify({
      merchant_id,
      hash,
      payment_url,
      order_id,
      amount: amountFormatted,
      currency,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
