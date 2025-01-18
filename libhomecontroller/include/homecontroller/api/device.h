#pragma once

#include "homecontroller/socket.io/client.h"

namespace hc {
namespace api {
template <typename StateType> class Device {
  public:
    struct Gateway {
        std::string m_url;
        std::string m_namespace;
    };

    Device(const std::string& log_context) : m_logger(log_context) {}
    ~Device() {}

    void start(const Gateway& gateway, const std::string& device_id,
               const std::string& secret, const StateType& initial_state,
               int reconn_delay, int reconn_attempts);

    void stop();

    const StateType& get_state() const { return m_state; }

    const util::Logger& get_logger() { return m_logger; }

  protected:
    virtual void
    on_command_received(::sio::socket::ptr socket,
                        std::map<std::string, ::sio::message::ptr>& data) = 0;

    virtual ::sio::message::ptr serialize_state() const = 0;

    virtual void loop() = 0;

    void update_state(::sio::socket::ptr socket, StateType new_state);

  private:
    void register_events();
    ::sio::message::ptr create_handshake_msg(const std::string& device_id,
                                             const std::string& secret);

    util::Logger m_logger;

    sio::Client m_client;

    StateType m_state;
};
} // namespace api
} // namespace hc