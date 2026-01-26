package cz.scrumdojo.quizmaster;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class FeatureFlag {

    private static boolean featureFlag = false;

    public static boolean isEnabled() {
        return featureFlag;
    }

    static {
        InputStream input = QuizmasterApplication.class.getClassLoader().getResourceAsStream("feature-flag.properties");
        if (input != null) try {
            Properties properties = new Properties();
            properties.load(input);
            featureFlag = Boolean.parseBoolean(properties.getProperty("feature.flag"));
        } catch (IOException ignored) {}
    }
}
