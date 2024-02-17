import { Events } from '@/Controllers/Configurations/Events';
import express from 'express';
import { InstallerHome } from '@/Installer/Server/InstallerHome';
import { RootPATH, StructuralModels } from '@/Structural';
import { InstallerSetupOne } from '@/Installer/Server/InstallerSetupOne';
import { InstallerSelectLang } from '@/Installer/Server/InstallerSelectLang';
import { Envsv, dirCR, gen, jsonsv } from '@/Utils';
import I18alt from '@/Controllers/Languages';
import { InstallerSetupTwo } from '@/Installer/Server/InstallerSetupTwo';
import { InstallerSetupTwoMysql } from '@/Installer/Server/InstallerSetupTwoMysql';
import { InstallerSetupThree } from '@/Installer/Server/InstallerSetupThree';
import { Sequelize } from 'sequelize';
import { Migrations } from '@/Controllers/Configurations/Migrations';
import CoreProvinder from '@/Models/Core.model';
import { Connection } from '@/Controllers/Sequelize/Connection';
import { InstallerSetupFinish } from './Server/InstallerSetupFinish';
import { InstallerSetupCompleted } from './Server/InstallerSetupCompleted';
import { delay } from '@/Utils';

export class InstallerServer {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        const i18n = new I18alt();
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.static(RootPATH + "/Http/Assets"));
        this.express.use("/icon", express.static("./node_modules/boxicons/"));

        this.express.get('/', (req, res) => {
            res.send(InstallerSelectLang());
        });

        this.express.post('/install', (req, res) => {
            const { lang } = req.body
            if (!lang) return res.status(400).redirect("/?error=" + encodeURIComponent(i18n.t("installer.ErrorSelectOneLang")))
            i18n.sl(lang)
            Envsv("CORE_LANGUAGE", lang, "Linguagem do painel")
            res.redirect("/install");
        });

        this.express.get('/install', (req, res) => {
            res.send(InstallerHome());
        });

        this.express.get('/install/setup/one', (req, res) => {
            res.send(InstallerSetupOne());
        });

        this.express.post('/install/setup/one', (req, res) => {
            const { url, title, port } = req.body
            if (!url || !title || !port) return res.status(400).redirect("/install/setup/one?error=" + encodeURIComponent(i18n.t("installer.ErrorNeedAll")))
            const Url = String(url)
            if (!Url.startsWith("http://") && !Url.startsWith("https://")) {
                return res.status(400).redirect("/install/setup/one?error=" + encodeURIComponent(i18n.t("installer.ErrorUrlHttp")))
            }
            Envsv("CORE_KEY", `core_key_${gen(64)}`)
            Envsv("CORE_URL", url)
            Envsv("CORE_TITLE", title)
            Envsv("CORE_PORT", port)
            res.redirect("/install/setup/two");
        });

        this.express.get('/install/setup/two', (req, res) => {
            res.send(InstallerSetupTwo());
        });

        this.express.post('/install/setup/two', (req, res) => {
            const { database } = req.body
            if (!database) return res.status(400).redirect("/install/setup/two?error=" + encodeURIComponent(i18n.t("installer.ErrorNeedAll")))
            if (database !== "mysql" && database !== "sqlite") return res.status(400).redirect("/install/setup/two?error=" + encodeURIComponent(i18n.t("installer.ErrorNeedAll")))
            Envsv("DB_DIALECT", database)
            if (database !== "sqlite") {
                res.redirect("/install/setup/two/mysql");
            } else {
                Envsv("DB_HOSTNAME", "./Core-ats.db.sqlite")
                res.redirect("/install/setup/three");
            }
        });

        this.express.get('/install/setup/two/mysql', (req, res) => {
            res.send(InstallerSetupTwoMysql());
        });

        this.express.post('/install/setup/two/mysql', async (req, res) => {
            const { database, user, port, host, pass } = req.body
            if (!database || !user || !port || !host || !pass) return res.status(400).redirect("/install/setup/one?error=" + encodeURIComponent(i18n.t("installer.ErrorNeedAll")))
            const Url = String(host)
            if (Url.startsWith("http://") || Url.startsWith("https://")) {
                return res.status(400).redirect("/install/setup/two/mysql?error=" + encodeURIComponent(i18n.t("installer.ErrorUrlNotHttp")))
            }
            if (Url.endsWith("/")) {
                return res.status(400).redirect("/install/setup/two/mysql?error=" + encodeURIComponent(i18n.t("installer.HttpEndBar")))
            }
            try {
                const connection = new Sequelize({
                    dialect: "mysql",
                    host,
                    password: pass,
                    port,
                    username: user,
                    database
                });
                await connection.authenticate()
            } catch (e) {
                return res.status(401).redirect("/install/setup/two/mysql?error=" + encodeURIComponent((e as { message: string }).message))
            }
            Envsv("DB_HOSTNAME", host)
            Envsv("DB_PORT", port)
            Envsv("DB_USERNAME", user)
            Envsv("DB_PASSWORD", pass)
            Envsv("DB_DATABASE", database)

            res.redirect("/install/setup/three");
        });

        this.express.get('/install/setup/three', (req, res) => {
            res.send(InstallerSetupThree());
        });

        this.express.post('/install/setup/three', async (req, res) => {
            try {
                await StructuralModels();
            } catch (e) {
                return res.status(401).redirect("/install/setup/two?error=" + encodeURIComponent((e as { message: string }).message))
            }
            res.redirect("/install/setup/finish");
        });

        this.express.get('/install/setup/finish', (req, res) => {
            res.send(InstallerSetupFinish());
        });

        this.express.post('/install/setup/finish', async (req, res) => {
            res.redirect("/install/setup/completed");
            await delay(2000);
            Events.set.emit("InstallationComplete");
        });

        this.express.get('/install/setup/completed', async(req, res) => {
            res.send(await InstallerSetupCompleted());
        });
    }
}
