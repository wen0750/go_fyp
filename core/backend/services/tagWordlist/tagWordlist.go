package tagWordlist

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/gin-gonic/gin"
	"gopkg.in/yaml.v2"
)

type YamlFile struct {
	Info struct {
		Tags string `yaml:"tags"`
	} `yaml:"info"`
}

// Helper function to check if a path exists
func doesPathExist(path string) bool {
	_, err := os.Stat(path)
	if err == nil {
		return true
	}
	if os.IsNotExist(err) {
		return false
	}
	return false
}

func GetWordlist() {
	// Get the current file's path
	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	// Define the relative directories where the subdirectories with YAML files are
	relativeDirectories := []string{
		"../tagWordlist/nuclei-templates/http/iot",
		"../tagWordlist/nuclei-templates/http/cnvd/2017",
		"../tagWordlist/nuclei-templates/http/cnvd/2018",
		"../tagWordlist/nuclei-templates/http/cnvd/2019",
		"../tagWordlist/nuclei-templates/http/cnvd/2020",
		"../tagWordlist/nuclei-templates/http/cnvd/2021",
		"../tagWordlist/nuclei-templates/http/cnvd/2022",
		"../tagWordlist/nuclei-templates/http/cnvd/2023",
		"../tagWordlist/nuclei-templates/http/credential-stuffing/cloud",
		"../tagWordlist/nuclei-templates/http/credential-stuffing/self-hosted",
		"../tagWordlist/nuclei-templates/http/cves/2000",
		"../tagWordlist/nuclei-templates/http/cves/2001",
		"../tagWordlist/nuclei-templates/http/cves/2002",
		"../tagWordlist/nuclei-templates/http/cves/2003",
		"../tagWordlist/nuclei-templates/http/cves/2004",
		"../tagWordlist/nuclei-templates/http/cves/2005",
		"../tagWordlist/nuclei-templates/http/cves/2006",
		"../tagWordlist/nuclei-templates/http/cves/2007",
		"../tagWordlist/nuclei-templates/http/cves/2008",
		"../tagWordlist/nuclei-templates/http/cves/2009",
		"../tagWordlist/nuclei-templates/http/cves/2010",
		"../tagWordlist/nuclei-templates/http/cves/2011",
		"../tagWordlist/nuclei-templates/http/cves/2012",
		"../tagWordlist/nuclei-templates/http/cves/2013",
		"../tagWordlist/nuclei-templates/http/cves/2014",
		"../tagWordlist/nuclei-templates/http/cves/2015",
		"../tagWordlist/nuclei-templates/http/cves/2016",
		"../tagWordlist/nuclei-templates/http/cves/2017",
		"../tagWordlist/nuclei-templates/http/cves/2018",
		"../tagWordlist/nuclei-templates/http/cves/2019",
		"../tagWordlist/nuclei-templates/http/cves/2020",
		"../tagWordlist/nuclei-templates/http/cves/2021",
		"../tagWordlist/nuclei-templates/http/cves/2022",
		"../tagWordlist/nuclei-templates/http/cves/2023",
		"../tagWordlist/nuclei-templates/http/default-logins",
		"../tagWordlist/nuclei-templates/http/default-logins/3com",
		"../tagWordlist/nuclei-templates/http/default-logins/abb",
		"../tagWordlist/nuclei-templates/http/default-logins/activemq",
		"../tagWordlist/nuclei-templates/http/default-logins/aem",
		"../tagWordlist/nuclei-templates/http/default-logins/alibaba",
		"../tagWordlist/nuclei-templates/http/default-logins/alphaweb",
		"../tagWordlist/nuclei-templates/http/default-logins/ambari",
		"../tagWordlist/nuclei-templates/http/default-logins/apache",
		"../tagWordlist/nuclei-templates/http/default-logins/apollo",
		"../tagWordlist/nuclei-templates/http/default-logins/arl",
		"../tagWordlist/nuclei-templates/http/default-logins/audiocodes",
		"../tagWordlist/nuclei-templates/http/default-logins/azkaban",
		"../tagWordlist/nuclei-templates/http/default-logins/caimore",
		"../tagWordlist/nuclei-templates/http/default-logins/chinaunicom",
		"../tagWordlist/nuclei-templates/http/default-logins/cobbler",
		"../tagWordlist/nuclei-templates/http/default-logins/d-link",
		"../tagWordlist/nuclei-templates/http/default-logins/datahub",
		"../tagWordlist/nuclei-templates/http/default-logins/dataiku",
		"../tagWordlist/nuclei-templates/http/default-logins/dell",
		"../tagWordlist/nuclei-templates/http/default-logins/digitalrebar",
		"../tagWordlist/nuclei-templates/http/default-logins/druid",
		"../tagWordlist/nuclei-templates/http/default-logins/dvwa",
		"../tagWordlist/nuclei-templates/http/default-logins/easyreport",
		"../tagWordlist/nuclei-templates/http/default-logins/elasticsearch",
		"../tagWordlist/nuclei-templates/http/default-logins/empire",
		"../tagWordlist/nuclei-templates/http/default-logins/emqx",
		"../tagWordlist/nuclei-templates/http/default-logins/exacqvision",
		"../tagWordlist/nuclei-templates/http/default-logins/feiyuxing",
		"../tagWordlist/nuclei-templates/http/default-logins/flir",
		"../tagWordlist/nuclei-templates/http/default-logins/frps",
		"../tagWordlist/nuclei-templates/http/default-logins/fuelcms",
		"../tagWordlist/nuclei-templates/http/default-logins/geoserver",
		"../tagWordlist/nuclei-templates/http/default-logins/gitlab",
		"../tagWordlist/nuclei-templates/http/default-logins/glpi",
		"../tagWordlist/nuclei-templates/http/default-logins/google",
		"../tagWordlist/nuclei-templates/http/default-logins/gophish",
		"../tagWordlist/nuclei-templates/http/default-logins/grafana",
		"../tagWordlist/nuclei-templates/http/default-logins/guacamole",
		"../tagWordlist/nuclei-templates/http/default-logins/hongdian",
		"../tagWordlist/nuclei-templates/http/default-logins/hortonworks",
		"../tagWordlist/nuclei-templates/http/default-logins/hp",
		"../tagWordlist/nuclei-templates/http/default-logins/huawei",
		"../tagWordlist/nuclei-templates/http/default-logins/hybris",
		"../tagWordlist/nuclei-templates/http/default-logins/ibm",
		"../tagWordlist/nuclei-templates/http/default-logins/idemia",
		"../tagWordlist/nuclei-templates/http/default-logins/iptime",
		"../tagWordlist/nuclei-templates/http/default-logins/jboss",
		"../tagWordlist/nuclei-templates/http/default-logins/jenkins",
		"../tagWordlist/nuclei-templates/http/default-logins/jinher",
		"../tagWordlist/nuclei-templates/http/default-logins/jupyterhub",
		"../tagWordlist/nuclei-templates/http/default-logins/kettle",
		"../tagWordlist/nuclei-templates/http/default-logins/leostream",
		"../tagWordlist/nuclei-templates/http/default-logins/lutron",
		"../tagWordlist/nuclei-templates/http/default-logins/mantisbt",
		"../tagWordlist/nuclei-templates/http/default-logins/minio",
		"../tagWordlist/nuclei-templates/http/default-logins/mobotix",
		"../tagWordlist/nuclei-templates/http/default-logins/mofi",
		"../tagWordlist/nuclei-templates/http/default-logins/nacos",
		"../tagWordlist/nuclei-templates/http/default-logins/nagios",
		"../tagWordlist/nuclei-templates/http/default-logins/netsus",
		"../tagWordlist/nuclei-templates/http/default-logins/nexus",
		"../tagWordlist/nuclei-templates/http/default-logins/nps",
		"../tagWordlist/nuclei-templates/http/default-logins/nsicg",
		"../tagWordlist/nuclei-templates/http/default-logins/o2oa",
		"../tagWordlist/nuclei-templates/http/default-logins/octobercms",
		"../tagWordlist/nuclei-templates/http/default-logins/ofbiz",
		"../tagWordlist/nuclei-templates/http/default-logins/openemr",
		"../tagWordlist/nuclei-templates/http/default-logins/openmediavault",
		"../tagWordlist/nuclei-templates/http/default-logins/openwrt",
		"../tagWordlist/nuclei-templates/http/default-logins/oracle",
		"../tagWordlist/nuclei-templates/http/default-logins/others",
		"../tagWordlist/nuclei-templates/http/default-logins/paloalto",
		"../tagWordlist/nuclei-templates/http/default-logins/panabit",
		"../tagWordlist/nuclei-templates/http/default-logins/pentaho",
		"../tagWordlist/nuclei-templates/http/default-logins/phpmyadmin",
		"../tagWordlist/nuclei-templates/http/default-logins/prtg",
		"../tagWordlist/nuclei-templates/http/default-logins/pyload",
		"../tagWordlist/nuclei-templates/http/default-logins/rabbitmq",
		"../tagWordlist/nuclei-templates/http/default-logins/rainloop",
		"../tagWordlist/nuclei-templates/http/default-logins/rancher",
		"../tagWordlist/nuclei-templates/http/default-logins/ricoh",
		"../tagWordlist/nuclei-templates/http/default-logins/riello",
		"../tagWordlist/nuclei-templates/http/default-logins/rockmongo",
		"../tagWordlist/nuclei-templates/http/default-logins/rseenet",
		"../tagWordlist/nuclei-templates/http/default-logins/ruckus",
		"../tagWordlist/nuclei-templates/http/default-logins/samsung",
		"../tagWordlist/nuclei-templates/http/default-logins/seeddms",
		"../tagWordlist/nuclei-templates/http/default-logins/seeyon",
		"../tagWordlist/nuclei-templates/http/default-logins/sequoiadb",
		"../tagWordlist/nuclei-templates/http/default-logins/showdoc",
		"../tagWordlist/nuclei-templates/http/default-logins/smartbi",
		"../tagWordlist/nuclei-templates/http/default-logins/solarwinds",
		"../tagWordlist/nuclei-templates/http/default-logins/sonarqube",
		"../tagWordlist/nuclei-templates/http/default-logins/spectracom",
		"../tagWordlist/nuclei-templates/http/default-logins/stackstorm",
		"../tagWordlist/nuclei-templates/http/default-logins/steve",
		"../tagWordlist/nuclei-templates/http/default-logins/supermicro",
		"../tagWordlist/nuclei-templates/http/default-logins/szhe",
		"../tagWordlist/nuclei-templates/http/default-logins/tooljet",
		"../tagWordlist/nuclei-templates/http/default-logins/trassir",
		"../tagWordlist/nuclei-templates/http/default-logins/UCMDB",
		"../tagWordlist/nuclei-templates/http/default-logins/umami",
		"../tagWordlist/nuclei-templates/http/default-logins/versa",
		"../tagWordlist/nuclei-templates/http/default-logins/vidyo",
		"../tagWordlist/nuclei-templates/http/default-logins/viewpoint",
		"../tagWordlist/nuclei-templates/http/default-logins/visionhub",
		"../tagWordlist/nuclei-templates/http/default-logins/wayos",
		"../tagWordlist/nuclei-templates/http/default-logins/weblogic",
		"../tagWordlist/nuclei-templates/http/default-logins/wifisky",
		"../tagWordlist/nuclei-templates/http/default-logins/wildfly",
		"../tagWordlist/nuclei-templates/http/default-logins/wso2",
		"../tagWordlist/nuclei-templates/http/default-logins/xerox",
		"../tagWordlist/nuclei-templates/http/default-logins/xnat",
		"../tagWordlist/nuclei-templates/http/default-logins/xxljob",
		"../tagWordlist/nuclei-templates/http/default-logins/yealink",
		"../tagWordlist/nuclei-templates/http/default-logins/zabbix",
		"../tagWordlist/nuclei-templates/http/default-logins/zmanda",
		"../tagWordlist/nuclei-templates/http/exposed-panels",
		"../tagWordlist/nuclei-templates/http/exposed-panels/adobe",
		"../tagWordlist/nuclei-templates/http/exposed-panels/apache",
		"../tagWordlist/nuclei-templates/http/exposed-panels/arcgis",
		"../tagWordlist/nuclei-templates/http/exposed-panels/avaya",
		"../tagWordlist/nuclei-templates/http/exposed-panels/backpack",
		"../tagWordlist/nuclei-templates/http/exposed-panels/bmc",
		"../tagWordlist/nuclei-templates/http/exposed-panels/c2",
		"../tagWordlist/nuclei-templates/http/exposed-panels/checkmk",
		"../tagWordlist/nuclei-templates/http/exposed-panels/checkpoint",
		"../tagWordlist/nuclei-templates/http/exposed-panels/cisco",
		"../tagWordlist/nuclei-templates/http/exposed-panels/concrete5",
		"../tagWordlist/nuclei-templates/http/exposed-panels/dzzoffice",
		"../tagWordlist/nuclei-templates/http/exposed-panels/evlink",
		"../tagWordlist/nuclei-templates/http/exposed-panels/forti",
		"../tagWordlist/nuclei-templates/http/exposed-panels/fortinet",
		"../tagWordlist/nuclei-templates/http/exposed-panels/gradle",
		"../tagWordlist/nuclei-templates/http/exposed-panels/ibm",
		"../tagWordlist/nuclei-templates/http/exposed-panels/ixbus",
		"../tagWordlist/nuclei-templates/http/exposed-panels/jboss",
		"../tagWordlist/nuclei-templates/http/exposed-panels/joget",
		"../tagWordlist/nuclei-templates/http/exposed-panels/kfm",
		"../tagWordlist/nuclei-templates/http/exposed-panels/mikrotik",
		"../tagWordlist/nuclei-templates/http/exposed-panels/mybb",
		"../tagWordlist/nuclei-templates/http/exposed-panels/osticket",
		"../tagWordlist/nuclei-templates/http/exposed-panels/parallels",
		"../tagWordlist/nuclei-templates/http/exposed-panels/qnap",
		"../tagWordlist/nuclei-templates/http/exposed-panels/redhat",
		"../tagWordlist/nuclei-templates/http/exposed-panels/ruijie",
		"../tagWordlist/nuclei-templates/http/exposed-panels/scriptcase",
		"../tagWordlist/nuclei-templates/http/exposed-panels/symantec",
		"../tagWordlist/nuclei-templates/http/exposed-panels/telesquare",
		"../tagWordlist/nuclei-templates/http/exposed-panels/tomcat",
		"../tagWordlist/nuclei-templates/http/exposed-panels/trendnet",
		"../tagWordlist/nuclei-templates/http/exposed-panels/versa",
		"../tagWordlist/nuclei-templates/http/exposed-panels/xoops",
		"../tagWordlist/nuclei-templates/http/exposed-panels/zoho",
		"../tagWordlist/nuclei-templates/http/exposed-panels/zyxel",
		"../tagWordlist/nuclei-templates/http/exposures/apis",
		"../tagWordlist/nuclei-templates/http/exposures/backups",
		"../tagWordlist/nuclei-templates/http/exposures/configs",
		"../tagWordlist/nuclei-templates/http/exposures/files",
		"../tagWordlist/nuclei-templates/http/exposures/logs",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/adafruit",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/adobe",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/age",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/airtable",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/algolia",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/alibaba",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/amazon",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/artifactory",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/asana",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/atlassian",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/azure",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/beamer",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/bitbucket",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/bitly",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/bittrex",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/clojars",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/cloudinary",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/codeclimate",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/codecov",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/coinbase",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/confluent",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/contentful",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/crates",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/databricks",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/datadog",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/digitalocean",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/discord",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/docker",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/doppler",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/droneci",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/dropbox",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/duffel",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/dynatrace",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/easypost",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/etsy",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/facebook",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/fastly",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/figma",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/finicity",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/finnhub",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/flickr",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/flutter",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/frameio",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/freshbooks",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/generic",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/github",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/gitlab",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/gitter",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/gocardless",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/google",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/grafana",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/hashicorp",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/heroku",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/heroku",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/jotform",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/loqate",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/mailchimp",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/mailgun",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/mapbox",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/microsoft",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/newrelic",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/nextjs",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/npm",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/nuget",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/openai",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/paypal",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/picatic",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/postman",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/pypi",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/razorpay",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/ruby",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/sauce",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/segment",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/sendgrid",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/shopify",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/slack",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/sonarqube",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/square",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/stackhawk",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/stripe",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/telegram",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/twilio",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/zapier",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/zendesk",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/zenserp",
		"../tagWordlist/nuclei-templates/http/exposures/tokens/zoho",
		"../tagWordlist/nuclei-templates/http/fuzzing",
		"../tagWordlist/nuclei-templates/http/miscellaneous",
		"../tagWordlist/nuclei-templates/http/misconfiguration/aem",
		"../tagWordlist/nuclei-templates/http/misconfiguration/adobe",
		"../tagWordlist/nuclei-templates/http/misconfiguration/airflow",
		"../tagWordlist/nuclei-templates/http/misconfiguration/akamai",
		"../tagWordlist/nuclei-templates/http/misconfiguration/apache",
		"../tagWordlist/nuclei-templates/http/misconfiguration/confluence",
		"../tagWordlist/nuclei-templates/http/misconfiguration/debug",
		"../tagWordlist/nuclei-templates/http/misconfiguration/drupal",
		"../tagWordlist/nuclei-templates/http/misconfiguration/gitlab",
		"../tagWordlist/nuclei-templates/http/misconfiguration/gocd",
		"../tagWordlist/nuclei-templates/http/misconfiguration/google",
		"../tagWordlist/nuclei-templates/http/misconfiguration/graphql",
		"../tagWordlist/nuclei-templates/http/misconfiguration/hp",
		"../tagWordlist/nuclei-templates/http/misconfiguration/installer",
		"../tagWordlist/nuclei-templates/http/misconfiguration/jenkins",
		"../tagWordlist/nuclei-templates/http/misconfiguration/jolokia",
		"../tagWordlist/nuclei-templates/http/misconfiguration/kubernetes",
		"../tagWordlist/nuclei-templates/http/misconfiguration/liferay",
		"../tagWordlist/nuclei-templates/http/misconfiguration/nacos",
		"../tagWordlist/nuclei-templates/http/misconfiguration/nginx",
		"../tagWordlist/nuclei-templates/http/misconfiguration/openbmcs",
		"../tagWordlist/nuclei-templates/http/misconfiguration/phpmyadmin",
		"../tagWordlist/nuclei-templates/http/misconfiguration/prometheus",
		"../tagWordlist/nuclei-templates/http/misconfiguration/proxy",
		"../tagWordlist/nuclei-templates/http/misconfiguration/sap",
		"../tagWordlist/nuclei-templates/http/misconfiguration/springboot",
		"../tagWordlist/nuclei-templates/http/misconfiguration/teamcity",
		"../tagWordlist/nuclei-templates/http/misconfiguration",
		"../tagWordlist/nuclei-templates/http/osint",
		"../tagWordlist/nuclei-templates/http/takeovers",
		"../tagWordlist/nuclei-templates/http/technologies/adobe",
		"../tagWordlist/nuclei-templates/http/technologies/apache",
		"../tagWordlist/nuclei-templates/http/technologies/aws",
		"../tagWordlist/nuclei-templates/http/technologies/dell",
		"../tagWordlist/nuclei-templates/http/technologies/google",
		"../tagWordlist/nuclei-templates/http/technologies/graylog",
		"../tagWordlist/nuclei-templates/http/technologies/ibm",
		"../tagWordlist/nuclei-templates/http/technologies/kubernetes",
		"../tagWordlist/nuclei-templates/http/technologies/kubernetes/etcd",
		"../tagWordlist/nuclei-templates/http/technologies/kubernetes/kube-api",
		"../tagWordlist/nuclei-templates/http/technologies/kubernetes/kubelet",
		"../tagWordlist/nuclei-templates/http/technologies/landesk",
		"../tagWordlist/nuclei-templates/http/technologies/microsoft",
		"../tagWordlist/nuclei-templates/http/technologies/nginx",
		"../tagWordlist/nuclei-templates/http/technologies/oracle",
		"../tagWordlist/nuclei-templates/http/technologies/sap",
		"../tagWordlist/nuclei-templates/http/technologies/telerik",
		"../tagWordlist/nuclei-templates/http/technologies/versa",
		"../tagWordlist/nuclei-templates/http/technologies/vmware",
		"../tagWordlist/nuclei-templates/http/technologies/wordpress",
		"../tagWordlist/nuclei-templates/http/technologies/wordpress/plugins",
		"../tagWordlist/nuclei-templates/http/technologies",
		"../tagWordlist/nuclei-templates/http/token-spray",
		"../tagWordlist/nuclei-templates/http/vulnerabilities",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/74cms",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/amazon",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/apache",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/apache/log4j",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/avaya",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/avtech",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/backdoor",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/cisco",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/code42",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/concrete",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/confluence",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/dedecms",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/discuz",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/drupal",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/fastjson",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/finereport",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/generic",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/gitea",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/gitlab",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/gnuboard",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/grafana",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/hikvision",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/httpbin",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/huawei",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/ibm",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/j2ee",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/jamf",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/jenkins",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/jinhe",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/jira",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/jolokia",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/joomla",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/jorani",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/landray",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/laravel",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/linkerd",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/magento",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/metersphere",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/mobileiron",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/moodle",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/netmizer",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/netsweeper",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/nps",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/nuxt",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/opencpu",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/oracle",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/oscommerce",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/other",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/php",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/prestashop",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/qax",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/rails",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/ransomware",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/realor",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/rocketchat",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/royalevent",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/ruijie",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/samsung",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/sangfor",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/secworld",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/seeyon",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/shiziyu-cms",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/simplecrm",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/sitecore",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/smartbi",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/splash",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/spring",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/springboot",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/squirrelmail",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/thinkcmf",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/thinkphp",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/tongda",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/topsec",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/ueditor",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/vbulletin",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/vmware",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/wanhu",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/weaver",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/weaver/ecology",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/weaver/eoffice",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/webp-server-go",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/wechat",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/wordpress",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/yonyou",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/zend",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/zyxel",
		"../tagWordlist/nuclei-templates/http/vulnerabilities/zzzcms",
	}

	// Open the output file
	tagList := "../tagList.txt"
	outputFilePath := filepath.Join(dir, tagList)
	outputFile, err := os.Create(outputFilePath)
	if err != nil {
		log.Fatal(err)
	}
	defer outputFile.Close()

	// Create a map to keep track of seen tags
	seenTags := make(map[string]bool)

	for _, relativeDirectory := range relativeDirectories {
		// Convert relative path to absolute path
		directory := filepath.Join(dir, relativeDirectory)

		// Check if the directory exists
		if doesPathExist(directory) {
			fmt.Println("Directory exists")

		} else {
			fmt.Println("Directory does not exist")
			continue
		}

		err = filepath.Walk(directory, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			// Check if the file has a .yaml extension
			if filepath.Ext(path) == ".yaml" {
				// Read the file
				data, err := os.ReadFile(path)
				if err != nil {
					return err
				}

				// Unmarshal the YAML data
				var ymlFile YamlFile
				err = yaml.Unmarshal(data, &ymlFile)
				if err != nil {
					return err
				}
				// Split the tags string into individual tags
				tags := strings.Split(ymlFile.Info.Tags, ",")

				// Write the tags to the file
				for _, tag := range tags {
					// If we've not seen this tag before, write it to the file
					if _, seen := seenTags[tag]; !seen {
						_, err = outputFile.WriteString(tag + "\n")
						if err != nil {
							return err
						}
						// Mark this tag as seen
						seenTags[tag] = true
					}
				}
			}

			return nil
		})

		if err != nil {
			fmt.Println("Error walking through directory:", err)
		}
	}
}

func Action_Search (c *gin.Context){

}

