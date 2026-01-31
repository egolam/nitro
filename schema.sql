DROP TABLE IF EXISTS products;

CREATE TABLE
    IF NOT EXISTS products (
        id INTEGER PRIMARY KEY UNIQUE,
        stock_id TEXT NOT NULL,
        factory_name TEXT NOT NULL,
        perfume TEXT NOT NULL,
        brand TEXT NOT NULL,
        manufacturer TEXT NOT NULL,
        slug TEXT NOT NULL,
        category TEXT NOT NULL CHECK (category IN ('erkek', 'kadın', 'unisex')),
        list_price REAL NOT NULL,
        delux BOOLEAN NOT NULL DEFAULT 0,
        is_new BOOLEAN NOT NULL DEFAULT 0,
        min_buy INTEGER NOT NULL DEFAULT 50,
        min_threshold INTEGER NOT NULL DEFAULT 1000,
        max_stock INTEGER NOT NULL DEFAULT 0,
        imgUrl TEXT NOT NULL DEFAULT "https://content.maresans.com/images/product1.webp",
        desc TEXT NOT NULL DEFAULT "tarafından üretilir.",
        tags TEXT NOT NULL DEFAULT "",
        total_ordered INTEGER NOT NULL DEFAULT 0,
        price_grams REAL NOT NULL DEFAULT 0.0,
        dolduruldu BOOLEAN NOT NULL DEFAULT 0,
        belgeler text not null default "",
        renk text not null default 'red',
        sira integer not null default 0
    );

CREATE INDEX idx_products_id ON products (id);

CREATE INDEX idx_products_order ON products (stock_id, id);

CREATE INDEX idx_products_ordered_id_total ON products (total_ordered DESC, id ASC);

CREATE INDEX idx_products_category ON products (category);

CREATE INDEX idx_products_delux ON products (delux);

CREATE INDEX idx_products_isnew ON products (is_new);

CREATE INDEX idx_products_delux_id ON products (delux, id);

CREATE INDEX idx_products_isnew_id ON products (is_new, id);

CREATE INDEX idx_products_category_id ON products (category, id);

CREATE INDEX idx_products_order_count_id ON products (category, total_ordered DESC, id ASC);

CREATE INDEX idx_products_delux_pagination ON products (delux, total_ordered DESC, id ASC);

CREATE INDEX idx_products_is_new_pagination ON products (is_new, total_ordered DESC, id ASC);

CREATE INDEX idx_products_delux_category ON products (category, delux, total_ordered DESC, id ASC);

CREATE INDEX idx_products_slug ON products (slug);

CREATE INDEX idx_products_search ON products (
    stock_id,
    factory_name,
    perfume,
    brand,
    manufacturer,
    category
);

DROP TABLE IF EXISTS users;

CREATE TABLE
    IF NOT EXISTS users (
        id TEXT NOT NULL DEFAULT '' UNIQUE,
        name TEXT DEFAULT NULL,
        email TEXT DEFAULT '' UNIQUE,
        image TEXT DEFAULT NULL,
        surname TEXT DEFAULT NULL,
        phone TEXT DEFAULT '' UNIQUE,
        password TEXT DEFAULT NULL,
        role TEXT NOT NULL CHECK (role IN ('user', 'admin')) DEFAULT 'user',
        emailVerified DATETIME DEFAULT NULL,
        otpVerified BOOLEAN DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );

CREATE INDEX idx_users_id ON users (id);

CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_phone ON users (phone);

CREATE INDEX idx_users_created_at ON users (created_at, id);

DROP TABLE IF EXISTS otp_codes;

CREATE TABLE
    otp_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT NOT NULL,
        code TEXT NOT NULL,
        used BOOLEAN DEFAULT 0,
        expires_at DATETIME NOT NULL DEFAULT (datetime ('now', '+183 minutes')),
        created_at DATETIME DEFAULT (datetime ('now', '+180 minutes')),
        FOREIGN KEY (phone) REFERENCES users (phone)
    );

CREATE INDEX idx_otp_codes_phone ON otp_codes (phone);

DROP TABLE IF EXISTS reset_password_tokens;

CREATE TABLE
    reset_password_tokens (
        id TEXT NOT NULL DEFAULT '' UNIQUE,
        email TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL DEFAULT (datetime ('now', '+183 minutes')),
        created_at DATETIME DEFAULT (datetime ('now', '+180 minutes')),
        FOREIGN KEY (email) REFERENCES users (email),
        PRIMARY KEY (id)
    );

CREATE INDEX idx_reset_password_tokens_email ON reset_password_tokens (email);

DROP TABLE IF EXISTS accounts;

CREATE TABLE
    IF NOT EXISTS accounts (
        id text NOT NULL,
        userId text NOT NULL DEFAULT NULL,
        type text NOT NULL DEFAULT NULL,
        provider text NOT NULL DEFAULT NULL,
        providerAccountId text NOT NULL DEFAULT NULL,
        refresh_token text DEFAULT NULL,
        access_token text DEFAULT NULL,
        expires_at number DEFAULT NULL,
        token_type text DEFAULT NULL,
        scope text DEFAULT NULL,
        id_token text DEFAULT NULL,
        session_state text DEFAULT NULL,
        oauth_token_secret text DEFAULT NULL,
        oauth_token text DEFAULT NULL,
        PRIMARY KEY (id)
    );

DROP TABLE IF EXISTS sessions;

CREATE TABLE
    IF NOT EXISTS sessions (
        id text NOT NULL,
        sessionToken text NOT NULL,
        userId text NOT NULL DEFAULT NULL,
        expires datetime NOT NULL DEFAULT NULL,
        PRIMARY KEY (sessionToken)
    );

DROP TABLE IF EXISTS verification_tokens;

CREATE TABLE
    IF NOT EXISTS verification_tokens (
        identifier text NOT NULL,
        token text NOT NULL DEFAULT NULL,
        expires datetime NOT NULL DEFAULT NULL,
        PRIMARY KEY (token)
    );

DROP TABLE IF EXISTS settings;

CREATE TABLE
    IF NOT EXISTS settings (
        liste_indirim REAL NOT NULL,
        kdv REAL NOT NULL,
        kar_marji REAL NOT NULL
    );

INSERT INTO
    settings (liste_indirim, kdv, kar_marji)
VALUES
    (0.20, 0.20, 0.2635);

DROP TABLE IF EXISTS rate;

CREATE TABLE
    IF NOT EXISTS rate (value REAL NOT NULL DEFAULT 41.312511);

INSERT INTO
    rate (value)
VALUES
    (41.312511);

DROP TABLE IF EXISTS order_status;

CREATE TABLE
    IF NOT EXISTS order_status (
        id INTEGER PRIMARY KEY,
        value TEXT NOT NULL CHECK (
            value IN (
                'open',
                'paused',
                'confirmed',
                'awaiting_payment',
                'factory'
            )
        )
    );

CREATE INDEX idx_order_status_id ON order_status (value);

INSERT INTO
    order_status (value)
VALUES
    ('open');

DROP TABLE IF EXISTS cache_counters;

CREATE TABLE
    IF NOT EXISTS cache_counters (
        product_counter INTEGER,
        order_counter INTEGER,
        user_counter INTEGER
    );

INSERT INTO
    cache_counters (product_counter, order_counter, user_counter)
VALUES
    (0, 0, 0);

DROP TABLE IF EXISTS favorites;

CREATE TABLE
    IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY UNIQUE,
        user_id TEXT NOT NULL DEFAULT '',
        product_id INTEGER NOT NULL DEFAULT '',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    );

CREATE INDEX idx_favorites_id ON favorites (id);

CREATE INDEX idx_favorites_user_id ON favorites (user_id);

CREATE INDEX idx_favorites_product_id ON favorites (product_id);

CREATE INDEX idx_favorites_user_id_product_id ON favorites (user_id, product_id);

CREATE INDEX idx_favorites_order_id ON favorites (created_at, id);

CREATE INDEX idx_favorites_order_product_id ON favorites (created_at, product_id);

CREATE INDEX idx_favorites_order_user_id ON favorites (created_at, user_id);

DROP TABLE IF EXISTS orders;

CREATE TABLE
    IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY UNIQUE,
        user_id TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER,
        status TEXT NOT NULL CHECK (
            status IN (
                'pending',
                'valid',
                'confirmed',
                "awaiting_payment",
                "payment_confirmed",
                "packaged",
                "shipped",
                "cancelled"
            )
        ) DEFAULT 'pending',
        total_amount REAL DEFAULT 0.0,
        sale_number INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    );

CREATE INDEX idx_orders_id ON orders (id);

CREATE INDEX idx_orders_user_id ON orders (user_id);

CREATE INDEX idx_orders_product_id ON orders (product_id);

CREATE INDEX idx_orders_sale_number ON orders (sale_number);

CREATE INDEX idx_orders_user_id_product_id ON orders (user_id, product_id);

CREATE INDEX idx_orders_user_id_status ON orders (user_id, status);

CREATE INDEX idx_orders_user_id_product_id_status ON orders (user_id, product_id, status);

CREATE INDEX idx_orders_quantity ON orders (quantity);

CREATE INDEX idx_orders_order ON orders (created_at, id);

CREATE INDEX idx_orders_search ON orders (status);

DROP TABLE IF EXISTS tickets;

CREATE TABLE
    IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY UNIQUE,
        order_id INTEGER NOT NULL,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (order_id) REFERENCES orders (id)
    );

CREATE INDEX idx_ticket_id ON tickets (id);

DROP TABLE IF EXISTS user_addresses;

CREATE TABLE
    IF NOT EXISTS user_addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL UNIQUE,
        is_default BOOLEAN NOT NULL DEFAULT 1,
        bill_type TEXT NOT NULL CHECK (bill_type IN ('bireysel', 'kurumsal')),
        first_name TEXT NOT NULL DEFAULT "",
        last_name TEXT NOT NULL DEFAULT "",
        address_line1 TEXT NOT NULL DEFAULT "",
        province TEXT NOT NULL DEFAULT "",
        district TEXT NOT NULL DEFAULT "",
        first_name_bill TEXT NOT NULL DEFAULT "",
        last_name_bill TEXT NOT NULL DEFAULT "",
        address_line1_bill TEXT NOT NULL DEFAULT "",
        province_bill TEXT NOT NULL DEFAULT "",
        district_bill TEXT NOT NULL DEFAULT "",
        firm_name TEXT NOT NULL DEFAULT "",
        tax_office TEXT NOT NULL DEFAULT "",
        tax_id TEXT NOT NULL DEFAULT "",
        country TEXT NOT NULL DEFAULT "Türkiye",
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );

CREATE INDEX idx_user_address_id ON user_addresses (id);

CREATE INDEX idx_user_address_user_id ON user_addresses (user_id);

DROP TABLE IF EXISTS payment_table;

CREATE TABLE
    IF NOT EXISTS payment_table (
        oid TEXT NOT NULL DEFAULT '' UNIQUE,
        status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')) DEFAULT 'pending',
        user_id TEXT NOT NULL,
        items BLOB NOT NULL,
        amount_paid REAL DEFAULT 0.0,
        sale_number INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );

CREATE INDEX idx_payment_table_id ON payment_table (oid);

CREATE INDEX idx_payment_table_user_id ON payment_table (user_id);

CREATE INDEX idx_payment_table_status ON payment_table (status);

CREATE INDEX idx_payment_table_status_user_id ON payment_table (status, user_id);

CREATE TRIGGER calculate_prices AFTER INSERT ON products BEGIN
UPDATE products
SET
    price_grams = CEIL(
        (
            (
                NEW.list_price * (
                    SELECT
                        value
                    FROM
                        rate
                )
            ) * 100
        ) * (
            1 - (
                SELECT
                    liste_indirim
                FROM
                    settings
            )
        ) * (
            1 + (
                SELECT
                    kdv
                FROM
                    settings
            )
        ) * (
            1 + (
                SELECT
                    kar_marji
                FROM
                    settings
            )
        ) / ((NEW.min_threshold) / (NEW.min_buy)) * ((NEW.min_buy) / (NEW.min_buy))
    )
WHERE
    id = NEW.id;

END;

CREATE TRIGGER update_calculate_prices AFTER
UPDATE ON products WHEN (NEW.list_price <> OLD.list_price) BEGIN
UPDATE products
SET
    price_grams = CEIL(
        (
            (
                NEW.list_price * (
                    SELECT
                        value
                    FROM
                        rate
                )
            ) * 100
        ) * (
            1 - (
                SELECT
                    liste_indirim
                FROM
                    settings
            )
        ) * (
            1 + (
                SELECT
                    kdv
                FROM
                    settings
            )
        ) * (
            1 + (
                SELECT
                    kar_marji
                FROM
                    settings
            )
        ) / ((NEW.min_threshold) / (NEW.min_buy)) * ((NEW.min_buy) / (NEW.min_buy))
    )
WHERE
    id = NEW.id;

END;

CREATE TRIGGER update_rate_calculate_prices AFTER
UPDATE ON rate BEGIN
UPDATE products
SET
    price_grams = CEIL(
        ((products.list_price * (NEW.value)) * 100) * (
            1 - (
                SELECT
                    liste_indirim
                FROM
                    settings
            )
        ) * (
            1 + (
                SELECT
                    kdv
                FROM
                    settings
            )
        ) * (
            1 + (
                SELECT
                    kar_marji
                FROM
                    settings
            )
        ) / ((products.min_threshold) / (products.min_buy)) * ((products.min_buy) / (products.min_buy))
    );

END;

CREATE TRIGGER update_settings_calculate_prices AFTER
UPDATE ON settings BEGIN
UPDATE products
SET
    price_grams = CEIL(
        (
            (
                products.list_price * (
                    SELECT
                        value
                    FROM
                        rate
                )
            ) * 100
        ) * (1 - (NEW.liste_indirim)) * (1 + (NEW.kdv)) * (1 + (NEW.kar_marji)) / ((products.min_threshold) / (products.min_buy)) * ((products.min_buy) / (products.min_buy))
    );

END;

CREATE TRIGGER update_order_status_on_threshold_up AFTER
UPDATE ON products WHEN (NEW.total_ordered / 1000) > (OLD.total_ordered / 1000) BEGIN
UPDATE orders
SET
    status = 'valid'
WHERE
    product_id = NEW.id;

END;

CREATE TRIGGER update_orders_after_cancel AFTER DELETE ON orders BEGIN
UPDATE products
SET
    total_ordered = (
        SELECT
            IFNULL (SUM(quantity), 0)
        FROM
            orders
        WHERE
            product_id = OLD.product_id
    )
WHERE
    id = OLD.product_id;

UPDATE orders
SET
    status = 'pending'
WHERE
    product_id = OLD.product_id;

UPDATE orders
SET
    status = 'valid'
WHERE
    id IN (
        SELECT
            id
        FROM
            (
                SELECT
                    o.id,
                    o.quantity,
                    SUM(o.quantity) OVER (
                        PARTITION BY
                            o.product_id
                        ORDER BY
                            o.id ROWS BETWEEN UNBOUNDED PRECEDING
                            AND CURRENT ROW
                    ) AS running_total,
                    p.total_ordered,
                    (p.total_ordered / 1000) * 1000 AS manufacturable_limit
                FROM
                    orders o
                    JOIN products p ON o.product_id = p.id
                WHERE
                    o.product_id = OLD.product_id
            )
        WHERE
            running_total <= manufacturable_limit
    );

END;