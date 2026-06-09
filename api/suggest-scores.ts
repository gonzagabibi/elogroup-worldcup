import type { VercelRequest, VercelResponse } from '@vercel/node'

const GROUPS = [
  { name: 'A', teams: ['México','África do Sul','Coreia do Sul','Rep. Tcheca'] },
  { name: 'B', teams: ['Canadá','Bósnia-Herz.','Catar','Suíça'] },
  { name: 'C', teams: ['Brasil','Marrocos','Haiti','Escócia'] },
  { name: 'D', teams: ['EUA','Paraguai','Austrália','Turquia'] },
  { name: 'E', teams: ['Alemanha','Curaçao','Costa do Marfim','Equador'] },
  { name: 'F', teams: ['Países Baixos','Japão','Suécia','Tunísia'] },
  { name: 'G', teams: ['Bélgica','Egito','Irã','Nova Zelândia'] },
  { name: 'H', teams: ['Espanha','Cabo Verde','Arábia Saudita','Uruguai'] },
  { name: 'I', teams: ['França','Senegal','Iraque','Noruega'] },
  { name: 'J', teams: ['Argentina','Argélia','Áustria','Jordânia'] },
  { name: 'K', teams: ['Portugal','Congo (RD)','Uzbequistão','Colômbia'] },
  { name: 'L', teams: ['Inglaterra','Croácia','Gana','Panamá'] },
]

const MATCHES = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const prompt = `Você é um especialista em futebol. Sugira placares realistas para todos os jogos da fase de grupos da Copa do Mundo 2026.

Retorne APENAS um JSON válido, sem nenhum texto antes ou depois, no seguinte formato:
{
  "groups": {
    "0": { "0-1-a": 2, "0-1-b": 1, "0-2-a": 3, "0-2-b": 0, ... },
    "1": { ... },
    ...
    "11": { ... }
  }
}

Os grupos e suas chaves de índice são:
${GROUPS.map((g, gi) => {
  const matches = MATCHES.map(([a, b]) => 
    `  "${a}-${b}-a" e "${a}-${b}-b": ${g.teams[a]} x ${g.teams[b]}`
  ).join('\n')
  return `Grupo ${g.name} (índice ${gi}):\n${matches}`
}).join('\n\n')}

Use seu conhecimento do ranking FIFA 2025 e forma recente dos times para sugerir placares plausíveis. Placares devem ser inteiros entre 0 e 5.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    res.status(200).json(parsed)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao gerar sugestão' })
  }
}