import db from '../../lib/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await db.query('SELECT * FROM todos ORDER BY id ASC');
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
      break;
    case 'POST':
      try {
        const { title } = req.body;
        const result = await db.query(
          'INSERT INTO todos (title) VALUES ($1) RETURNING *',
          [title]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
      break;
    case 'PUT':
      try {
        const { id, completed } = req.body;
        const result = await db.query(
          'UPDATE todos SET completed = $1 WHERE id = $2 RETURNING *',
          [completed, id]
        );
        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
      break;
    case 'DELETE':
      try {
        const { id } = req.body;
        await db.query('DELETE FROM todos WHERE id = $1', [id]);
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
