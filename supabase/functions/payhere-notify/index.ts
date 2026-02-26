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
    // PayHere sends IPN as form-encoded POST
    const formData = await req.formData()
    const merchant_id = formData.get('merchant_id') as string
    const order_id = formData.get('order_id') as string
    const payhere_amount = formData.get('payhere_amount') as string
    const payhere_currency = formData.get('payhere_currency') as string
    const status_code = formData.get('status_code') as string
    const md5sig = formData.get('md5sig') as string

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Get payment config to verify
    const { data: config } = await supabase
      .from('payment_config')
      .select('*')
      .limit(1)
      .single()

    if (!config) {
      return new Response('Config not found', { status: 500 })
    }

    const isSandbox = config.mode === 'sandbox'
    const merchant_secret = isSandbox ? config.sandbox_merchant_secret : config.live_merchant_secret

    if (!merchant_secret) {
      return new Response('Secret not configured', { status: 500 })
    }

    // Verify hash: md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5(merchant_secret).toUpperCase())
    const encoder = new TextEncoder()
    const secretHash = await crypto.subtle.digest('MD5', encoder.encode(merchant_secret))
    const secretHashHex = Array.from(new Uint8Array(secretHash)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()

    const localInput = merchant_id + order_id + payhere_amount + payhere_currency + status_code + secretHashHex
    const localHash = await crypto.subtle.digest('MD5', encoder.encode(localInput))
    const localMd5 = Array.from(new Uint8Array(localHash)).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase()

    if (localMd5 !== md5sig?.toUpperCase()) {
      return new Response('Invalid signature', { status: 403 })
    }

    // status_code: 2 = success, 0 = pending, -1 = canceled, -2 = failed, -3 = chargeback
    let payment_status: string
    let order_status: string
    let note: string

    if (status_code === '2') {
      payment_status = 'paid'
      order_status = 'processing'
      note = 'Payment confirmed by PayHere'
    } else if (status_code === '0') {
      payment_status = 'pending'
      order_status = 'pending'
      note = 'Payment pending'
    } else {
      payment_status = 'failed'
      order_status = 'cancelled'
      note = `Payment failed (code: ${status_code})`
    }

    // Update order
    await supabase.from('orders').update({
      payment_status,
      status: order_status,
      payhere_order_id: order_id,
      updated_at: new Date().toISOString(),
    }).eq('id', order_id)

    // Insert status history
    await supabase.from('order_status_history').insert({
      order_id,
      status: order_status,
      note,
    })

    return new Response('OK', { status: 200 })
  } catch (err) {
    console.error('PayHere notify error:', err)
    return new Response('Error', { status: 500 })
  }
})
