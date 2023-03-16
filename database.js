import mysql from 'mysql2'

const pool = mysql.createPool({
    host:'carbontagdbfree.cd4kpomq4wkc.eu-west-2.rds.amazonaws.com',
    user:'admin',
    password: '12345678',
    database:'carbonTag'
}).promise()

export const getFabric = async (fabric) => {
    fabric = fabric.toLowerCase();
    const [rows] = await pool.query(`
        SELECT DISTINCT fabric_type 
        FROM ghg WHERE 
        fabric_name LIKE ${"'%" + fabric + "'"}
    `)
    const types = []
    rows.map(row => types.push(row['fabric_type']))
    return types;
}

export const getCountry = async (fabric, method) => {
    fabric = fabric.toLowerCase();
    const [rows] = await pool.query(`
        SELECT DISTINCT country
        FROM ghg WHERE 
        fabric_name LIKE ${"'%" + fabric + "'"}
        AND 
        fabric_type = ${"'" + method + "'"}
    `)
    const countries = []
    rows.map(row => countries.push(row['country']))
    countries.sort()
    return countries;
}

export const getKPI = async (fabric, method, country) => {
    fabric = fabric.toLowerCase();
    const [rows] = await pool.query(`
        SELECT *
        FROM ghg WHERE 
        fabric_name LIKE ${"'%" + fabric + "'"}
        AND 
        fabric_type = ${"'" + method + "'"}
        AND
        country = ${"'" + country + "'"}        
    `)
    let res = 0
    rows.map(row => res += row['fabric_eKPI_intensity'])
    return res
}


export const getCategories = async () => {
    const [rows] = await pool.query(`
        SELECT *
        FROM weight
    `)
    const categories = []
    rows.map(row => categories.push(row['category_name']))
    return categories
}

export const getWeight = async (name) => {
    const [rows] = await pool.query(`
        SELECT weight
        FROM weight
        WHERE
        category_name = ${"'" + name + "'"}
    `)
    return rows[0]
}

export const getPosts = async () => {
    const [rows] = await pool.query(`SELECT * FROM post`)
    return rows
}

export const getSubStacks = async () => {
    const [rows] = await pool.query(`SELECT * FROM posts`)
    return rows
}

export const getPost = async (id) => {
    const [rows] = await pool.query(`SELECT * FROM post WHERE post_id = ${"'" + id + "'"}`)
    return rows[0]
}

export const savePost = async (payload) => {
    console.log(payload)
    await pool.query(`INSERT INTO post (post_id, post_title, post_time, post_text, post_image, post_tags) values (?, ?, ?, ?, ?, ?)`, [payload.postId, payload.title, payload.postTime, payload.text, payload.image, payload.tags])
}

export const saveSubStack = async (payload) => {
    console.log(payload)
    await pool.query(`INSERT INTO posts (post_id, title, url, summary, cover) values (?, ?, ?, ?, ?)`, [payload.postId, payload.title, payload.url, payload.summary, payload.cover])
}
