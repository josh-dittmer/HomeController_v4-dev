#include "rgb_lights.h"

#include <csignal>
#include <iostream>

RGBLights r;

int main(int argc, char* argv[]) {
    std::signal(SIGINT, [](int s) { r.shutdown(); });

    // overwritten later by value set in config
    hc::util::Logger::set_log_level(hc::util::Logger::LogLevel::NORMAL);

    r.get_logger().log("RGBLights for HomeController v1.0.0");
    r.get_logger().log("Created by Josh Dittmer");

    if (!r.init()) {
        r.get_logger().fatal("Exiting with non-zero status code");
        return -1;
    }

    r.get_logger().log("RGBLights stopped, exiting gracefully");

    return 0;
}